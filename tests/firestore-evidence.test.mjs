import test from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import {FirestoreEvidence,CHUNK_BYTES,MAX_ENCRYPTED_BYTES,EVIDENCE_BUDGET_BYTES} from '../server/intake/firestore-evidence.mjs'
function fixture(){
 const docs=new Map()
 const snap=r=>({exists:docs.has(r.path),data:()=>docs.get(r.path)})
 const collection=path=>({doc:id=>ref(path+'/'+id),limit:()=>({get:async()=>({docs:[]})})})
 const ref=path=>({path,collection:name=>collection(path+'/'+name),get:async()=>snap({path})})
 const db={collection,runTransaction:async fn=>{
  const pending=[]
  const tx={get:async r=>snap(r),create:(r,d)=>{if(docs.has(r.path))throw new Error('Exists');pending.push(()=>docs.set(r.path,d))},set:(r,d)=>pending.push(()=>docs.set(r.path,d)),delete:r=>pending.push(()=>docs.delete(r.path))}
  const result=await fn(tx);for(const w of pending)w();return result
 }}
 return {docs,evidence:new FirestoreEvidence(db)}
}
const path=()=>crypto.randomUUID()+'.enc'
test('free encrypted evidence round trips binary chunks below Firestore document limit',async()=>{
 const {docs,evidence}=fixture(),name=path(),bytes=crypto.randomBytes(MAX_ENCRYPTED_BYTES)
 await evidence.file(name).save(bytes)
 const chunks=[...docs].filter(([k])=>k.includes('/chunks/'))
 assert.equal(chunks.length,Math.ceil(bytes.length/CHUNK_BYTES))
 for(const [,d] of chunks)assert.ok(d.data.length<=CHUNK_BYTES)
 assert.deepEqual((await evidence.file(name).download())[0],bytes)
 await assert.rejects(evidence.file(name).save(bytes))
})
test('free evidence refuses missing, corrupt or reordered ciphertext chunks',async()=>{
 const {docs,evidence}=fixture(),name=path()
 await evidence.file(name).save(crypto.randomBytes(CHUNK_BYTES+100))
 const first='iila_evidence/'+name+'/chunks/00'
 const data=docs.get(first);data.data[0]^=1
 await assert.rejects(evidence.file(name).download())
 docs.delete(first);await assert.rejects(evidence.file(name).download())
})
test('free evidence capacity refuses writes atomically without deleting submitted objects',async()=>{
 const {docs,evidence}=fixture(),name=path()
 docs.set('iila_system/evidence_usage',{bytes:EVIDENCE_BUDGET_BYTES-10})
 await assert.rejects(evidence.file(name).save(Buffer.alloc(11)))
 assert.equal(docs.has('iila_evidence/'+name),false)
 assert.equal(docs.get('iila_system/evidence_usage').bytes,EVIDENCE_BUDGET_BYTES-10)
 assert.equal(await evidence.ready(),true)
 docs.set('iila_system/evidence_usage',{bytes:EVIDENCE_BUDGET_BYTES})
 assert.equal(await evidence.ready(),false)
})
test('draft object deletion removes all chunks and recovers exactly its byte allowance',async()=>{
 const {docs,evidence}=fixture(),name=path(),bytes=crypto.randomBytes(CHUNK_BYTES+50)
 await evidence.file(name).save(bytes)
 assert.equal(docs.get('iila_system/evidence_usage').bytes,bytes.length)
 await evidence.file(name).delete()
 assert.equal([...docs.keys()].filter(k=>k.includes(name)).length,0)
 assert.equal(docs.get('iila_system/evidence_usage').bytes,0)
 await evidence.file(name).delete()
 assert.throws(()=>evidence.file('../outside.enc'))
 await assert.rejects(evidence.file(path()).save(Buffer.alloc(MAX_ENCRYPTED_BYTES+1)))
})
