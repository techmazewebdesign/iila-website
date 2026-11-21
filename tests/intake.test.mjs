import test from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import {readFile} from 'node:fs/promises'
import {sections,visible,validate,cleanData,SCHEMA_VERSION} from '../src/intake/schema.js'
import {encrypt,decrypt,issueSession,verifySession,hmac,validateFile} from '../server/intake/security.mjs'
import {configured,staff,setupStaff,origin} from '../server/intake/service.mjs'
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
test('Firebase staff requires verified token, exact UID, verified email and enrolled TOTP',async()=>{
 const uid='firebase-staff-fixture',factor='totp-fixture';process.env.INTAKE_STAFF_IDS=uid
 const claims={uid,email_verified:true,auth_time:Date.now()/1000,firebase:{sign_in_second_factor:'totp',second_factor_identifier:factor}}
 const user={uid,emailVerified:true,disabled:false,multiFactor:{enrolledFactors:[{uid:factor,factorId:'totp'}]}}
 let revoked=false
 const client={auth:{verifyIdToken:async(token,checkRevoked)=>{assert.equal(checkRevoked,true);if(revoked)throw new Error('Revoked');return claims},getUser:async()=>user}}
 const req={headers:{authorization:'Bearer fictional-token'}}
 await assert.rejects(staff({headers:{}},client))
 assert.equal(await staff(req,client),uid)
 claims.firebase.sign_in_second_factor='phone';await assert.rejects(staff(req,client))
 claims.firebase.sign_in_second_factor='totp';user.multiFactor.enrolledFactors=[];await assert.rejects(staff(req,client))
 user.multiFactor.enrolledFactors=[{uid:factor,factorId:'totp'}];user.disabled=true;await assert.rejects(staff(req,client));user.disabled=false
 claims.email_verified=false;await assert.rejects(staff(req,client));claims.email_verified=true
 process.env.INTAKE_STAFF_IDS='someone-else';await assert.rejects(staff(req,client));process.env.INTAKE_STAFF_IDS=uid
 revoked=true;await assert.rejects(staff(req,client))
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
test('sensitive routes isolate analytics and reject framing',async()=>{
 const config=JSON.parse(await readFile(new URL('../vercel.json',import.meta.url),'utf8'))
 assert.deepEqual(config.regions,['fra1'])
 const privacy=await readFile(new URL('../src/pages/IntakePrivacy.jsx',import.meta.url),'utf8');assert.ok(privacy.includes('Firebase'));assert.ok(!privacy.includes('Supabase'))
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
 let infected=false,stale=false,closeEarly=false
 const server=tls.createServer({key:await read(join(dir,'key.pem')),cert:await read(join(dir,'cert.pem')),ca:await read(join(dir,'cert.pem')),requestCert:true,rejectUnauthorized:true},socket=>{
  let received=Buffer.alloc(0)
  socket.on('error',()=>{})
  socket.on('data',chunk=>{
   if(closeEarly){socket.end();return}
   received=Buffer.concat([received,chunk])
   if(received.subarray(0,9).toString()==='zVERSION\0'){socket.end('ClamAV 1.4.3/12345/'+new Date(Date.now()-(stale?72*60*60*1000:0)).toUTCString()+'\0');return}
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
  closeEarly=true;await assert.rejects(clam(),{code:'scanner_unavailable'});closeEarly=false
  const trustedCA=process.env.INTAKE_CLAMAV_CA;delete process.env.INTAKE_CLAMAV_CA;await assert.rejects(clam(),{code:'scanner_unavailable'});process.env.INTAKE_CLAMAV_CA=trustedCA
  const clientCert=process.env.INTAKE_CLAMAV_CLIENT_CERT,clientKey=process.env.INTAKE_CLAMAV_CLIENT_KEY;delete process.env.INTAKE_CLAMAV_CLIENT_CERT;delete process.env.INTAKE_CLAMAV_CLIENT_KEY;await assert.rejects(clam(),{code:'scanner_unavailable'});process.env.INTAKE_CLAMAV_CLIENT_CERT=clientCert;process.env.INTAKE_CLAMAV_CLIENT_KEY=clientKey
  await clam();stale=true;await assert.rejects(clam(),{code:'scanner_unavailable'});stale=false
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

test('staff setup exposes only setup status and never bypasses MFA for cases',async()=>{
 const uid='setup-staff-fixture';process.env.INTAKE_STAFF_IDS=uid
 const user={uid,emailVerified:false,disabled:false,multiFactor:{enrolledFactors:[]}}
 const claims={uid,email_verified:false,auth_time:Date.now()/1000,firebase:{}}
 const client={auth:{verifyIdToken:async()=>claims,getUser:async()=>user}}
 const req={headers:{authorization:'Bearer fictional'}}
 assert.deepEqual(await setupStaff(req,client),{emailVerified:false,totpEnrolled:false})
 await assert.rejects(staff(req,client))
 user.emailVerified=true;claims.email_verified=true
 assert.deepEqual(await setupStaff(req,client),{emailVerified:true,totpEnrolled:false})
 await assert.rejects(staff(req,client))
 process.env.INTAKE_STAFF_IDS='different-staff';await assert.rejects(setupStaff(req,client))
})
test('preview setup accepts only its exact deployment origin',()=>{
 const previous={VERCEL_ENV:process.env.VERCEL_ENV,VERCEL_URL:process.env.VERCEL_URL}
 process.env.VERCEL_ENV='preview';process.env.VERCEL_URL='iila-fictional.vercel.app'
 try{
  assert.doesNotThrow(()=>origin({headers:{origin:'https://iila-fictional.vercel.app','sec-fetch-site':'same-origin'}}))
  assert.throws(()=>origin({headers:{origin:'https://other-preview.vercel.app'}}))
  assert.throws(()=>origin({headers:{origin:'https://iila-swiss.org'}}))
 }finally{for(const [k,v] of Object.entries(previous)){if(v===undefined)delete process.env[k];else process.env[k]=v}}
})

test('server entry loads with CommonJS require-of-ESM disabled on hosted runtime',async()=>{
 const {spawnSync}=await import('node:child_process')
 const result=spawnSync(process.execPath,['--no-experimental-require-module','--input-type=module','-e',"await import('./api/intake.js')"],{cwd:new URL('../',import.meta.url),encoding:'utf8'})
 assert.equal(result.status,0,result.stderr)
})

test('anonymous staff setup is rejected before database initialisation or quota writes',async()=>{
 const res=response()
 await handler({method:'POST',url:'/api/intake?action=staff-setup',headers:{origin:'https://iila-swiss.org','content-type':'application/json'},body:{}},res)
 assert.equal(res.statusCode,401);assert.deepEqual(res.body,{code:'unauthorised'})
})

test('scanner certificates isolate server/client roles and refuse overwriting keys',async()=>{
 const {mkdtemp,rm,stat}=await import('node:fs/promises'),{tmpdir}=await import('node:os'),{join}=await import('node:path'),{spawnSync}=await import('node:child_process')
 const dir=await mkdtemp(join(tmpdir(),'iila-pki-test-')),target=join(dir,'pki')
 try{
  const generate=spawnSync(process.execPath,['scripts/scanner-certificates.mjs','scanner.example.invalid',target],{cwd:new URL('../',import.meta.url),encoding:'utf8'})
  assert.equal(generate.status,0,generate.stderr)
  const verify=(purpose,file,extra=[])=>spawnSync('openssl',['verify','-CAfile',join(target,'ca.pem'),'-purpose',purpose,...extra,join(target,file)],{encoding:'utf8'})
  assert.equal(verify('sslserver','server.pem',['-verify_hostname','scanner.example.invalid']).status,0)
  assert.equal(verify('sslclient','client.pem').status,0)
  assert.notEqual(verify('sslserver','client.pem').status,0)
  assert.notEqual(verify('sslclient','server.pem').status,0)
  assert.notEqual(verify('sslserver','server.pem',['-verify_hostname','attacker.invalid']).status,0)
  for(const file of ['ca.key','server.key','client.key'])assert.equal((await stat(join(target,file))).mode&0o777,0o600)
  assert.equal((await stat(target)).mode&0o777,0o700)
  const duplicate=spawnSync(process.execPath,['scripts/scanner-certificates.mjs','scanner.example.invalid',target],{cwd:new URL('../',import.meta.url),encoding:'utf8'})
  assert.notEqual(duplicate.status,0)
 }finally{await rm(dir,{recursive:true,force:true})}
})
