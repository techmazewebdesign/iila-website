import test from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import {readFile} from 'node:fs/promises'
import {PGlite} from '@electric-sql/pglite'
import {sections,visible,validate,cleanData,SCHEMA_VERSION} from '../src/intake/schema.js'
import {encrypt,decrypt,issueSession,verifySession,hmac,validateFile} from '../server/intake/security.mjs'
import {configured,staff} from '../server/intake/service.mjs'
import handler from '../api/intake.js'

process.env.INTAKE_SESSION_KEY='ab'.repeat(32)
const key='cd'.repeat(32)
function fixture(){
 const d={}
 for(const f of sections.flatMap(s=>s.fields)){
  if(!visible(f,d)||!f.required)continue
  d[f.name]=f.type==='checks'?[f.options[0][0]]:f.type==='consent'?true:f.options?f.options[0][0]:f.type==='date'?'2020-01-02':'Fictional test only'
 }
 d.email='fictional@example.invalid';d.phone='+000000000'
 return d
}
test('complete valid application and bilingual labels',()=>{
 const d=fixture();assert.deepEqual(validate(d),{})
 for(const f of sections.flatMap(s=>s.fields)){assert.ok(f.en);assert.ok(f.fa);assert.ok(/[\u0600-\u06ff]/.test(f.fa))}
 assert.equal(SCHEMA_VERSION,'2026-11-20-v1')
})
test('conditional fields, consents and contact rules enforced server-side',()=>{
 const d=fixture();d.processingConsent=false;d.email='';d.phone='';d.dualNationality='yes';delete d.otherNationalities
 const errors=validate(d)
 assert.ok(errors.processingConsent);assert.ok(errors.email);assert.ok(errors.otherNationalities)
 d.categories=['not-an-option'];assert.ok(validate(d).categories)
 d.categories='eye';assert.ok(validate(d).categories)
})
test('hidden answers and unknown keys are discarded; invalid dates rejected',()=>{
 const d=fixture();d.previousReport='no';d.previousReference='secret stale answer';d.admin=true;d.incidentDate='2020-02-31'
 const clean=cleanData(d);assert.equal(clean.previousReference,undefined);assert.equal(clean.admin,undefined);assert.ok(validate(clean).incidentDate)
 assert.ok(validate({...d,incidentDescription:'x'.repeat(12001)}).incidentDescription)
})
test('authenticated encryption detects modification and context swapping',()=>{
 const input=Buffer.from('fictional confidential content')
 const sealed=encrypt(input,key,'case:123')
 assert.deepEqual(decrypt(sealed,key,'case:123'),input)
 assert.ok(!sealed.includes(input));assert.notDeepEqual(sealed,encrypt(input,key,'case:123'))
 assert.throws(()=>decrypt(sealed,key,'case:another'))
 const tampered=Buffer.from(sealed);tampered[tampered.length-1]^=1
 assert.throws(()=>decrypt(tampered,key,'case:123'))
})
test('sessions expire and forged cookies fail',()=>{
 const token=issueSession(1700000000000),cookie='__Host-iila-intake='+token
 assert.equal(verifySession(cookie,1700000000001),token)
 assert.throws(()=>verifySession(cookie,1700004000000))
 assert.throws(()=>verifySession(cookie.replace(token.slice(0,5),'fffff'),1700000000001))
 assert.notEqual(hmac('csrf:'+token),hmac('session:'+token))
})
test('file spoofing, active formats, malformed base64 and oversized images rejected',()=>{
 const png=Buffer.from([137,80,78,71,13,10,26,10,0,0])
 assert.deepEqual(validateFile({name:'test.png',type:'image/png',base64:png.toString('base64')}),png)
 for(const data of [
 {name:'payload.svg',type:'image/svg+xml',base64:Buffer.from('<svg onload="alert(1)">').toString('base64')},
 {name:'test.png',type:'image/png',base64:Buffer.from('not a PNG').toString('base64')},
 {name:'test.jpg',type:'image/jpeg',base64:png.toString('base64')},
 {name:'test.png',type:'image/png',base64:'%bad'},
 {name:'test.png',type:'image/png',base64:Buffer.alloc(3145729).toString('base64')}
 ])assert.throws(()=>validateFile(data))
})
test('staff authorisation requires validated user, allowlist and aal2',async()=>{
 const id=crypto.randomUUID();process.env.INTAKE_STAFF_IDS=id
 const client={auth:{getUser:async()=>({data:{user:{id}},error:null})}}
 const req=aal=>({headers:{authorization:'Bearer e30.'+Buffer.from(JSON.stringify({sub:id,aal,exp:Math.floor(Date.now()/1000)+100})).toString('base64url')+'.signature'}})
 await assert.rejects(staff({headers:{}},client))
 await assert.rejects(staff(req('aal1'),client))
 assert.equal(await staff(req('aal2'),client),id)
 process.env.INTAKE_STAFF_IDS=crypto.randomUUID()
 await assert.rejects(staff(req('aal2'),client))
})
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.statusCode=n;return this},json(v){this.body=v;return this},send(v){this.body=v;return this}}}
test('unconfigured API is fail-closed; no false submission success',async()=>{
 delete process.env.INTAKE_COLLECTION_ENABLED
 assert.equal(configured(),false)
 const config=response();await handler({method:'GET',url:'/api/intake?action=config',headers:{}},config)
 assert.equal(config.statusCode,200);assert.equal(config.body.active,false);assert.equal(config.headers['Cache-Control'],'no-store, max-age=0')
 const blocked=response();await handler({method:'POST',url:'/api/intake?action=submit',headers:{origin:'https://iila-swiss.org','content-type':'application/json'},body:{}},blocked)
 assert.equal(blocked.statusCode,503);assert.equal(blocked.body.code,'unavailable')
 const cross=response();await handler({method:'POST',url:'/api/intake?action=submit',headers:{origin:'https://attacker.invalid','content-type':'application/json'},body:{}},cross)
 assert.equal(cross.statusCode,403)
 assert.ok(!JSON.stringify(blocked.body).includes('SUPABASE'))
})
test('database migration, RLS, rate limits, evidence ownership and idempotency',async()=>{
 const pg=new PGlite()
 await pg.exec("create role anon; create role authenticated; create role service_role bypassrls; create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);grant usage on schema storage to service_role;grant select on storage.buckets to service_role;")
 await pg.exec(await readFile(new URL('../database/iila-intake.sql',import.meta.url),'utf8'))
 let b=await pg.query("select public from storage.buckets where id='iila-evidence'");assert.equal(b.rows[0].public,false)
 await pg.exec('set role anon')
 await assert.rejects(pg.query('select * from public.iila_cases'))
 await assert.rejects(pg.query("select public.iila_rate_limit('x',1)"))
 await pg.exec('reset role;set role authenticated')
 await assert.rejects(pg.query('select * from public.iila_uploads'))
 await assert.rejects(pg.query('select * from public.iila_audit'))
 await pg.exec('reset role;set role service_role')
 for(let i=0;i<3;i++){const r=await pg.query("select public.iila_rate_limit('fakehash',2) as allowed");assert.equal(r.rows[0].allowed,i<2)}
 const id=crypto.randomUUID(),other=crypto.randomUUID(),caseId=crypto.randomUUID()
 await pg.query("select public.iila_reserve_upload($1,'owner-a')",[id])
 await pg.query("update public.iila_uploads set state='ready',metadata_sealed='encrypted' where id=$1",[id])
 await assert.rejects(pg.query("select public.iila_submit($1,'IILA-TEST','owner-b','ciphertext',$2::uuid[],true,'fa',90)",[caseId,[id]]))
 const first=await pg.query("select public.iila_submit($1,'IILA-TEST','owner-a','ciphertext',$2::uuid[],true,'fa',90) as reference",[caseId,[id]])
 assert.equal(first.rows[0].reference,'IILA-TEST')
 const retry=await pg.query("select public.iila_submit($1,'IILA-DUPLICATE','owner-a','ciphertext',$2::uuid[],true,'fa',90) as reference",[caseId,[id]])
 assert.equal(retry.rows[0].reference,'IILA-TEST')
 await assert.rejects(pg.query("select public.iila_submit($1,'IILA-THIEF','owner-b','ciphertext',$2::uuid[],true,'fa',90)",[caseId,[]]))
 for(let i=0;i<5;i++)await pg.query("select public.iila_reserve_upload($1,'owner-c')",[crypto.randomUUID()])
 await assert.rejects(pg.query("select public.iila_reserve_upload($1,'owner-c')",[other]))
 const count=await pg.query('select count(*)::int as n from public.iila_cases');assert.equal(count.rows[0].n,1)
 const attached=await pg.query("select state,case_id from public.iila_uploads where id=$1",[id]);assert.equal(attached.rows[0].state,'attached');assert.equal(attached.rows[0].case_id,caseId)
 await pg.close()
})
test('sensitive routes isolate analytics and reject framing',async()=>{
 const config=JSON.parse(await readFile(new URL('../vercel.json',import.meta.url),'utf8'))
 const headers=config.routes[0].headers
 assert.ok(headers['Content-Security-Policy'].includes("script-src 'self'"))
 assert.ok(!headers['Content-Security-Policy'].includes('googletagmanager'))
 assert.equal(headers['X-Frame-Options'],'DENY')
 const guard=await readFile(new URL('../public/intake-navigation.js',import.meta.url),'utf8')
 assert.ok(guard.includes('stopImmediatePropagation'))
})

test('TLS scanner validates images, rejects malware, and notifications omit case data',async()=>{
 const {mkdtemp,readFile:read,rm}=await import('node:fs/promises')
 const {tmpdir}=await import('node:os')
 const {join}=await import('node:path')
 const {execFileSync}=await import('node:child_process')
 const tls=await import('node:tls'),sharp=(await import('sharp')).default
 const nodemailer=(await import('nodemailer')).default
 const {mock}=await import('node:test')
 const {clam}=await import('../server/intake/security.mjs')
 const {upload,submit}=await import('../server/intake/service.mjs')
 const dir=await mkdtemp(join(tmpdir(),'iila-scanner-test-'))
 execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',join(dir,'key.pem'),'-out',join(dir,'cert.pem'),'-days','1','-subj','/CN=localhost','-addext','subjectAltName=DNS:localhost'],{stdio:'ignore'})
 let infected=false
 const server=tls.createServer({key:await read(join(dir,'key.pem')),cert:await read(join(dir,'cert.pem')),ca:await read(join(dir,'cert.pem')),requestCert:true,rejectUnauthorized:true},socket=>{
  let received=Buffer.alloc(0)
  socket.on('error',()=>{})
  socket.on('data',chunk=>{
   received=Buffer.concat([received,chunk])
   if(received.subarray(0,6).toString()==='zPING\0'){socket.end('PONG\0');return}
   if(received.length<10||received.subarray(0,10).toString()!=='zINSTREAM\0')return
   let n=10
   while(n+4<=received.length){
    const len=received.readUInt32BE(n);n+=4
    if(len===0){socket.end(infected?'stream: Eicar-Test-Signature FOUND\0':'stream: OK\0');return}
    if(n+len>received.length)return
    n+=len
   }
  })
 })
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
 process.env.INTAKE_CLAMAV_HOST='localhost';process.env.INTAKE_CLAMAV_PORT=String(server.address().port);process.env.INTAKE_CLAMAV_CA=await read(join(dir,'cert.pem'),'utf8');process.env.INTAKE_ENCRYPTION_KEY=key;process.env.INTAKE_CLAMAV_CLIENT_CERT=await read(join(dir,'cert.pem'),'utf8');process.env.INTAKE_CLAMAV_CLIENT_KEY=await read(join(dir,'key.pem'),'utf8')
 try{
  await clam()
  const bytes=await sharp({create:{width:4,height:4,channels:3,background:'#ffffff'}}).png().toBuffer()
  await clam(bytes);infected=true;await assert.rejects(clam(bytes),{code:'unsafe_image'});infected=false
  const cookieToken=issueSession(), req={headers:{cookie:'__Host-iila-intake='+cookieToken,'x-csrf-token':hmac('csrf:'+cookieToken)}}
  let stored
  const chain={eq:async()=>({data:null,error:null})}
  const client={
   rpc:async(name)=>({data:name==='iila_rate_limit'?true:name==='iila_reserve_upload'?'reserved':'IILA-TEST-ONLY',error:null}),
   storage:{from:()=>({upload:async(path,b)=>{stored={path,bytes:b};return {data:{path},error:null}}})},
   from:()=>({update:()=>({eq(){return {eq:async()=>({data:null,error:null}),then(resolve){resolve({data:null,error:null})}}}})})
  }
  const id=crypto.randomUUID()
  const result=await upload(client,req,{uploadId:id,name:'fictional.png',type:'image/png',base64:bytes.toString('base64')})
  assert.equal(result.id,id);assert.equal(stored.path,id+'.enc')
  assert.notDeepEqual(stored.bytes,bytes);assert.deepEqual(decrypt(stored.bytes,key,'evidence:'+id),bytes)
  infected=true;await assert.rejects(upload(client,req,{uploadId:crypto.randomUUID(),name:'fictional.png',type:'image/png',base64:bytes.toString('base64')}),{code:'unsafe_image'});infected=false
  let sent
  const stub=mock.method(nodemailer,'createTransport',()=>({sendMail:async mail=>{sent=mail},close(){}}))
  const d=fixture();d.incidentDescription='SECRET-FICTIONAL-INCIDENT';d.email='private-fictional@example.invalid'
  const outcome=await submit(client,req,{data:d,fileIds:[id],requestId:crypto.randomUUID(),schemaVersion:SCHEMA_VERSION,website:''})
  assert.equal(outcome.reference,'IILA-TEST-ONLY');assert.equal(sent.to,'info@iila-swiss.org');assert.equal(sent.attachments,undefined)
  assert.ok(!JSON.stringify(sent).includes(d.incidentDescription));assert.ok(!JSON.stringify(sent).includes(d.email))
  stub.mock.restore()
 }finally{
  await new Promise(resolve=>server.close(resolve));delete process.env.INTAKE_CLAMAV_CLIENT_CERT;delete process.env.INTAKE_CLAMAV_CLIENT_KEY;delete process.env.INTAKE_CLAMAV_CA;delete process.env.INTAKE_CLAMAV_HOST;delete process.env.INTAKE_CLAMAV_PORT
  await rm(dir,{recursive:true,force:true})
 }
})
