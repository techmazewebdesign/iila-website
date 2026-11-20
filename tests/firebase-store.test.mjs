import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {FirebaseStore} from '../server/intake/firebase-store.mjs'
// Transaction test double: exercises the production adapter's invariants.
// Does not claim to verify the hosted Firestore service, IAM, or rules engine.
function fixture(){
 const records=new Map()
 const ref=(table,id)=>({id,path:table+'/'+id})
 const snapshot=r=>({ref:r,id:r.id,exists:records.has(r.path),data:()=>structuredClone(records.get(r.path))})
 const collection=table=>({doc:id=>ref(table,id)})
 const firestore={collection,runTransaction:async fn=>{
  const writes=[],tx={
   get:async r=>snapshot(r),
   set:(r,d)=>writes.push(()=>records.set(r.path,structuredClone(d))),
   create:(r,d)=>{if(records.has(r.path))throw new Error('Exists');writes.push(()=>records.set(r.path,structuredClone(d)))},
   update:(r,d)=>writes.push(()=>records.set(r.path,{...records.get(r.path),...structuredClone(d)})),
   delete:r=>writes.push(()=>records.delete(r.path))
  }
  const result=await fn(tx);for(const w of writes)w();return result
 }}
 const deleted=[]
 const bucket={file:path=>({delete:async()=>deleted.push(path)})}
 return {records,deleted,store:new FirebaseStore(firestore,bucket,{})}
}
test('Firestore upload quotas and owner checks reject reuse',async()=>{
 const {store}=fixture()
 for(let i=0;i<5;i++)assert.equal((await store.rpc('iila_reserve_upload',{p_id:'file'+i,p_owner:'owner'})).data,'reserved')
 assert.ok((await store.rpc('iila_reserve_upload',{p_id:'file6',p_owner:'owner'})).error)
 assert.ok((await store.rpc('iila_reserve_upload',{p_id:'file0',p_owner:'other'})).error)
})
test('Firestore submission is atomic, idempotent and enforces evidence ownership',async()=>{
 const {store,records}=fixture()
 records.set('iila_uploads/file',{id:'file',owner_hash:'owner',state:'ready',case_id:null,created_at:new Date().toISOString()})
 const p={p_id:'case',p_reference:'IILA-TEST',p_owner:'owner',p_sealed:'encrypted',p_files:['file'],p_risk:true,p_language:'fa'}
 assert.ok((await store.rpc('iila_submit',{...p,p_owner:'other'})).error)
 assert.equal(records.has('iila_cases/case'),false)
 assert.equal(records.get('iila_uploads/file').state,'ready')
 assert.equal((await store.rpc('iila_submit',p)).data,'IILA-TEST')
 assert.equal(records.get('iila_uploads/file').case_id,'case')
 assert.equal((await store.rpc('iila_submit',{...p,p_reference:'DUPLICATE'})).data,'IILA-TEST')
 assert.ok((await store.rpc('iila_submit',{...p,p_owner:'other'})).error)
 assert.ok((await store.rpc('iila_submit',{...p,p_id:'another'})).error)
 assert.equal(records.get('iila_cases/case').verified_at,null)
 assert.equal('delete_after' in records.get('iila_cases/case'),false)
})
test('Firestore rejects duplicate and expired evidence and enforces rate limits',async()=>{
 const {store,records}=fixture()
 const p={p_id:'case',p_reference:'test',p_owner:'owner',p_sealed:'encrypted',p_files:['file','file']}
 assert.ok((await store.rpc('iila_submit',p)).error)
 records.set('iila_uploads/file',{owner_hash:'owner',state:'ready',case_id:null,created_at:'2000-01-01T00:00:00Z'})
 assert.ok((await store.rpc('iila_submit',{...p,p_files:['file']})).error)
 for(let i=0;i<4;i++)assert.equal((await store.rpc('iila_rate_limit',{p_key:'hash',p_limit:2})).data,i<2)
})
test('draft cleanup cannot remove attached evidence regardless of age',async()=>{
 const {store,records,deleted}=fixture()
 records.set('iila_uploads/attached',{case_id:'case',state:'attached',created_at:'1900-01-01T00:00:00Z'})
 records.set('iila_uploads/draft',{case_id:null,state:'ready',created_at:'2000-01-01T00:00:00Z'})
 await store.cleanupDraft('attached',new Date().toISOString())
 await store.cleanupDraft('draft',new Date().toISOString())
 assert.deepEqual(deleted,['draft.enc'])
 assert.ok(records.has('iila_uploads/attached'))
 assert.equal(records.has('iila_uploads/draft'),false)
})
test('bucket readiness rejects public or legacy ACL configurations',async()=>{
 const fs={}
 for(const iamConfiguration of [{},{publicAccessPrevention:'inherited',uniformBucketLevelAccess:{enabled:true}},{publicAccessPrevention:'enforced',uniformBucketLevelAccess:{enabled:false}}]){
  const store=new FirebaseStore(fs,{getMetadata:async()=>[{iamConfiguration}]},{})
  assert.ok((await store.storage.getBucket()).error)
 }
 const store=new FirebaseStore(fs,{getMetadata:async()=>[{iamConfiguration:{publicAccessPrevention:'enforced',uniformBucketLevelAccess:{enabled:true}}}]},{})
 assert.equal((await store.storage.getBucket()).data.public,false)
})
test('client access is denied to all intake documents and evidence',async()=>{
 for(const path of ['firestore.rules','storage.rules']){
  const rules=await readFile(new URL('../'+path,import.meta.url),'utf8')
  assert.ok(rules.includes('allow read, write: if false;'))
 }
})
