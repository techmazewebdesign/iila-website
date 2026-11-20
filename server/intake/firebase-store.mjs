import {getApps,initializeApp,applicationDefault,cert} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import {getAuth} from 'firebase-admin/auth'
import {getStorage} from 'firebase-admin/storage'

const now=()=>new Date().toISOString()
const expired=value=>Date.parse(value)<Date.now()-3600000
const reject=()=>{throw new Error('Invalid intake operation')}
const tables=new Set(['iila_cases','iila_uploads','iila_rates','iila_audit','iila_owners'])
export function firebaseApp(){
 const projectId=process.env.INTAKE_FIREBASE_PROJECT_ID
 if(!projectId)throw new Error('Firebase is not configured')
 let app=getApps().find(a=>a.name==='iila-intake')
 if(app&&app.options.projectId!==projectId)throw new Error('Firebase project mismatch')
 if(!app){
  const raw=process.env.INTAKE_FIREBASE_SERVICE_ACCOUNT
  const credential=raw?cert(JSON.parse(raw)):applicationDefault()
  app=initializeApp({projectId,credential,storageBucket:process.env.INTAKE_FIREBASE_STORAGE_BUCKET},'iila-intake')
 }
 return app
}
// Narrow internal compatibility facade; all operations run on the trusted server.
// No browser SDK can read these collections or objects directly.
export class FirebaseStore{
 constructor(firestore,bucket,auth){this.firestore=firestore;this.bucket=bucket;this.auth=auth
  this.storage={
   getBucket:async()=>{try{const [m]=await bucket.getMetadata();if(m.iamConfiguration?.publicAccessPrevention!=='enforced'||!m.iamConfiguration?.uniformBucketLevelAccess?.enabled)throw new Error('Private bucket required');return {data:{public:false}}}catch{return {error:true}}},
   from:()=>({
    upload:async(path,bytes)=>{try{await bucket.file(path).save(bytes,{resumable:false,contentType:'application/octet-stream',preconditionOpts:{ifGenerationMatch:0}});return {data:{path}}}catch{return {error:true}}},
    download:async path=>{try{const [b]=await bucket.file(path).download();return {data:{arrayBuffer:async()=>b}}}catch{return {error:true}}},
    remove:async paths=>{try{for(const p of paths)await bucket.file(p).delete({ignoreNotFound:true});return {data:null}}catch{return {error:true}}}
   })
  }
 }
 async cleanupDraft(id,cutoff){
  const ref=this.firestore.collection('iila_uploads').doc(id)
  const locked=await this.firestore.runTransaction(async tx=>{
   const s=await tx.get(ref),d=s.data()
   if(!d||d.case_id||d.created_at>=cutoff)return false
   tx.update(ref,{state:'deleting'});return true
  })
  if(!locked)return
  await this.bucket.file(id+'.enc').delete({ignoreNotFound:true})
  await this.firestore.runTransaction(async tx=>{
   const s=await tx.get(ref),d=s.data()
   if(d&&!d.case_id&&d.state==='deleting')tx.delete(ref)
  })
 }
 from(table){if(!tables.has(table))reject();return new Query(this.firestore,table)}
 async rpc(name,p={}){
  try{
   if(name==='iila_ready'){await this.firestore.collection('iila_cases').limit(1).get();return {data:true}}
   const value=await this.firestore.runTransaction(async tx=>{
    if(name==='iila_rate_limit'){
     const ref=this.firestore.collection('iila_rates').doc(p.p_key),s=await tx.get(ref),old=s.data()
     const fresh=!old||expired(old.window_start),count=fresh?1:old.count+1
     tx.set(ref,{key:p.p_key,count,window_start:fresh?now():old.window_start})
     return count<=p.p_limit
    }
    if(name==='iila_reserve_upload'){
     const ref=this.firestore.collection('iila_uploads').doc(p.p_id),ownerRef=this.firestore.collection('iila_owners').doc(p.p_owner)
     const [existing,owner]=await Promise.all([tx.get(ref),tx.get(ownerRef)])
     if(existing.exists){const d=existing.data();if(d.owner_hash===p.p_owner&&d.state==='ready')return 'exists';reject()}
     const old=owner.data(),fresh=!old||expired(old.window_start),count=fresh?0:old.count
     if(count>=5)reject()
     tx.set(ownerRef,{count:count+1,window_start:fresh?now():old.window_start})
     tx.create(ref,{id:p.p_id,owner_hash:p.p_owner,state:'reserved',created_at:now(),case_id:null})
     return 'reserved'
    }
    if(name==='iila_submit'){
     if(!Array.isArray(p.p_files)||p.p_files.length>5||new Set(p.p_files).size!==p.p_files.length)reject()
     const ref=this.firestore.collection('iila_cases').doc(p.p_id),previous=await tx.get(ref)
     if(previous.exists){if(previous.data().owner_hash!==p.p_owner)reject();return previous.data().reference}
     const refs=p.p_files.map(id=>this.firestore.collection('iila_uploads').doc(id))
     const files=await Promise.all(refs.map(r=>tx.get(r)))
     for(const file of files){const d=file.data();if(!d||d.owner_hash!==p.p_owner||d.state!=='ready'||expired(d.created_at)||d.case_id)reject()}
     tx.create(ref,{id:p.p_id,reference:p.p_reference,owner_hash:p.p_owner,payload_sealed:p.p_sealed,high_risk:p.p_risk,language:p.p_language,created_at:now(),status:'received',verified_at:null,notified_at:null,notes_sealed:null,legal_hold:false})
     for(const r of refs)tx.update(r,{case_id:p.p_id,state:'attached'})
     return p.p_reference
    }
    reject()
   })
   return {data:value}
  }catch{return {error:true}}
 }
}
class Query{
 constructor(firestore,table){this.firestore=firestore;this.collection=firestore.collection(table);this.filters=[];this.mode='select';this.fields='*';this.maximum=100}
 select(fields='*'){this.fields=fields;return this}
 insert(value){this.mode='insert';this.value=value;return this}
 update(value){this.mode='update';this.value=value;return this}
 delete(){this.mode='delete';return this}
 eq(k,v){this.filters.push([k,'==',v]);return this}
 is(k,v){return this.eq(k,v)}
 lt(k,v){this.filters.push([k,'<',v]);return this}
 order(k,{ascending=true}={}){this.sort=[k,ascending?'asc':'desc'];return this}
 limit(n){this.maximum=Math.min(n,100);return this}
 single(){this.one=true;return this}
 then(resolve,rejectPromise){return this.execute().then(resolve,rejectPromise)}
 async execute(){
  try{
   if(this.mode==='insert'){await this.collection.add({...this.value,created_at:now()});return {data:null}}
   let q=this.collection
   for(const [k,op,v] of this.filters)q=q.where(k,op,v)
   if(this.sort)q=q.orderBy(...this.sort)
   const snap=await q.limit(this.maximum).get()
   if(this.mode==='select'){
    let data=snap.docs.map(s=>({id:s.id,...s.data()}))
    if(this.fields!=='*'){const fields=this.fields.split(',');data=data.map(d=>Object.fromEntries(fields.map(f=>[f,d[f]??null])))}
    if(this.one){if(data.length!==1)throw new Error('Missing record');data=data[0]}
    return {data}
   }
   // Re-read every document under a transaction to avoid stale ownership/state filters.
   await this.firestore.runTransaction(async tx=>{
    const docs=await Promise.all(snap.docs.map(s=>tx.get(s.ref)))
    for(const d of docs){
     if(!d.exists||!this.filters.every(([k,op,v])=>op==='=='?d.data()[k]===v:d.data()[k]<v))continue
     if(this.mode==='delete')tx.delete(d.ref);else tx.update(d.ref,this.value)
    }
   })
   return {data:null}
  }catch{return {error:true}}
 }
}
export function createFirebaseStore(){
 const app=firebaseApp()
 return new FirebaseStore(getFirestore(app),getStorage(app).bucket(),getAuth(app))
}
