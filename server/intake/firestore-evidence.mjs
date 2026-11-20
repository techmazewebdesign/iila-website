import crypto from 'node:crypto'
// Small-volume Spark deployment. Binary chunks are NOT indexed (see indexes).
export const CHUNK_BYTES=512*1024
export const MAX_ENCRYPTED_BYTES=3*1024*1024+64
export const EVIDENCE_BUDGET_BYTES=512*1024*1024
const validPath=/^[0-9a-f-]{36}\.enc$/i
const invalid=()=>{throw new Error('Evidence storage unavailable')}
export class FirestoreEvidence{
 constructor(firestore){this.firestore=firestore;this.usage=firestore.collection('iila_system').doc('evidence_usage')}
 async ready(){
  await this.firestore.collection('iila_evidence').limit(1).get()
  const usage=await this.usage.get(),bytes=usage.data()?.bytes||0
  return Number.isSafeInteger(bytes)&&bytes>=0&&bytes<EVIDENCE_BUDGET_BYTES
 }

 file(path){
  if(!validPath.test(path))invalid()
  const root=this.firestore.collection('iila_evidence').doc(path)
  const chunkRef=i=>root.collection('chunks').doc(String(i).padStart(2,'0'))
  return {
   save:async bytes=>{
    if(!Buffer.isBuffer(bytes)||!bytes.length||bytes.length>MAX_ENCRYPTED_BYTES)invalid()
    const count=Math.ceil(bytes.length/CHUNK_BYTES),digest=crypto.createHash('sha256').update(bytes).digest('hex')
    await this.firestore.runTransaction(async tx=>{
     const [existing,usage]=await Promise.all([tx.get(root),tx.get(this.usage)])
     if(existing.exists)invalid()
     const used=usage.data()?.bytes||0
     if(!Number.isSafeInteger(used)||used<0||used+bytes.length>EVIDENCE_BUDGET_BYTES)invalid()
     tx.create(root,{bytes:bytes.length,count,sha256:digest,created_at:new Date().toISOString()})
     for(let i=0;i<count;i++)tx.create(chunkRef(i),{data:bytes.subarray(i*CHUNK_BYTES,(i+1)*CHUNK_BYTES)})
     tx.set(this.usage,{bytes:used+bytes.length})
    })
   },
   download:async()=>{
    const bytes=await this.firestore.runTransaction(async tx=>{
     const manifest=await tx.get(root),m=manifest.data()
     if(!m||!Number.isSafeInteger(m.bytes)||m.bytes<1||m.bytes>MAX_ENCRYPTED_BYTES||m.count!==Math.ceil(m.bytes/CHUNK_BYTES))invalid()
     const docs=await Promise.all(Array.from({length:m.count},(_,i)=>tx.get(chunkRef(i))))
     const pieces=docs.map((s,i)=>{
      const data=s.data()?.data
      if(!data)invalid()
      const b=Buffer.from(data),expected=i===m.count-1?m.bytes-i*CHUNK_BYTES:CHUNK_BYTES
      if(b.length!==expected)invalid()
      return b
     })
     const b=Buffer.concat(pieces)
     if(crypto.createHash('sha256').update(b).digest('hex')!==m.sha256)invalid()
     return b
    })
    return [bytes]
   },
   delete:async()=>{
    await this.firestore.runTransaction(async tx=>{
     const [manifest,usage]=await Promise.all([tx.get(root),tx.get(this.usage)]),m=manifest.data()
     if(!m)return
     if(!Number.isSafeInteger(m.bytes)||m.bytes<1||m.bytes>MAX_ENCRYPTED_BYTES||m.count!==Math.ceil(m.bytes/CHUNK_BYTES))invalid()
     const used=usage.data()?.bytes
     if(!Number.isSafeInteger(used)||used<m.bytes)invalid()
     for(let i=0;i<m.count;i++)tx.delete(chunkRef(i))
     tx.delete(root);tx.set(this.usage,{bytes:used-m.bytes})
    })
   }
  }
 }
}
