import crypto from 'node:crypto'
import {createClient} from '@supabase/supabase-js'
import nodemailer from 'nodemailer'
import sharp from 'sharp'
import {SCHEMA_VERSION,validate,cleanData,MAX_FILES} from '../../src/intake/schema.js'
import {encrypt,decrypt,hmac,equal,issueSession,verifySession,validateFile,clam,fail} from './security.mjs'
export const STATUSES=['received','awaiting_review','legal_review','needs_evidence','documenting','ready_for_decision','verified','referred','closed']
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const required=['SUPABASE_URL','SUPABASE_SECRET_KEY','SUPABASE_PUBLISHABLE_KEY','INTAKE_ENCRYPTION_KEY','INTAKE_SESSION_KEY','INTAKE_STAFF_IDS','INTAKE_CLAMAV_HOST','INTAKE_CLAMAV_CLIENT_CERT','INTAKE_CLAMAV_CLIENT_KEY','INTAKE_SMTP_PASSWORD','INTAKE_PRIVACY_VERSION']
export function configured() {
 return required.every(k=>Boolean(process.env[k]))&&/^[a-f0-9]{64}$/i.test(process.env.INTAKE_ENCRYPTION_KEY||'')&&/^[a-f0-9]{64}$/i.test(process.env.INTAKE_SESSION_KEY||'')&&process.env.INTAKE_COLLECTION_ENABLED==='true'&&process.env.INTAKE_SECURITY_VERIFIED==='true'&&process.env.INTAKE_MAIL_VERIFIED==='true'
}
export function db() {
 if(!process.env.SUPABASE_URL||!process.env.SUPABASE_SECRET_KEY)fail(503,'unavailable')
 return createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}})
}
const must=result=>{if(result.error)fail(503,'unavailable');return result.data}
const key=()=>process.env.INTAKE_ENCRYPTION_KEY
export const pack=(value,context)=>encrypt(value,key(),context).toString('base64')
export const unpack=(value,context)=>JSON.parse(decrypt(Buffer.from(value,'base64'),key(),context).toString())
export async function ready(client=db()) {
 if(!configured())return false
 try{const bucket=must(await client.storage.getBucket('iila-evidence'));if(bucket.public)return false;if(must(await client.rpc('iila_ready'))!==true)return false;await clam();return true}catch{return false}
}
export async function limited(client,req,kind) {
 // Vercel overwrites x-vercel-forwarded-for at the trusted ingress.
 const ip=process.env.VERCEL?String(req.headers['x-vercel-forwarded-for']||'unknown').split(',')[0].trim():'local'
 const allowed=must(await client.rpc('iila_rate_limit',{p_key:hmac(kind+':'+ip),p_limit:kind==='session'?10:kind==='upload'?30:20}))
 if(!allowed)fail(429,'rate_limited')
}
export function origin(req) {
 if(req.headers.origin!==(process.env.INTAKE_ORIGIN||'https://iila-swiss.org'))fail(403,'forbidden')
 if(req.headers['sec-fetch-site']&&req.headers['sec-fetch-site']!=='same-origin')fail(403,'forbidden')
}
export function session(req) {
 const token=verifySession(req.headers.cookie)
 if(!equal(req.headers['x-csrf-token'],hmac('csrf:'+token)))fail(403,'forbidden')
 return hmac('session:'+token)
}
export async function staff(req,client=db()) {
 const match=/^Bearer (.+)$/.exec(req.headers.authorization||'');if(!match)fail(401,'unauthorised')
 const {data,error}=await client.auth.getUser(match[1])
 if(error||!data.user)fail(401,'unauthorised')
 let claims;try{claims=JSON.parse(Buffer.from(match[1].split('.')[1],'base64url').toString())}catch{fail(401,'unauthorised')}
 // Claims are used only after the Auth server has validated this exact token.
 if(claims.aal!=='aal2'||claims.sub!==data.user.id||claims.exp*1000<Date.now())fail(403,'mfa_required')
 if(!(process.env.INTAKE_STAFF_IDS||'').split(',').map(s=>s.trim()).includes(data.user.id))fail(403,'forbidden')
 return data.user.id
}
export async function audit(client,actor,action,caseId=null) {
 must(await client.from('iila_audit').insert({actor_id:actor,action,case_id:caseId}))
}
export async function upload(client,req,body) {
 const owner=session(req);await limited(client,req,'upload')
 if(!UUID.test(body.uploadId||''))fail(400,'invalid_image')
 const bytes=validateFile(body)
 const image=sharp(bytes,{limitInputPixels:20000000,failOn:'warning'}),meta=await image.metadata().catch(()=>fail(400,'invalid_image'))
 if(!['png','jpeg'].includes(meta.format)||meta.pages>1)fail(400,'invalid_image')
 // Decode the full image to reject truncated/corrupt files; keep originals as evidence.
 await image.raw().toBuffer().catch(()=>fail(400,'invalid_image'))
 await clam(bytes)
 const id=body.uploadId
 const reservation=must(await client.rpc('iila_reserve_upload',{p_id:id,p_owner:owner}))
 if(reservation==='exists')return {id}
 const path=id+'.enc',ciphertext=encrypt(bytes,key(),'evidence:'+id)
 const stored=await client.storage.from('iila-evidence').upload(path,ciphertext,{contentType:'application/octet-stream',upsert:false})
 if(stored.error){await client.from('iila_uploads').update({state:'failed'}).eq('id',id).eq('owner_hash',owner);fail(503,'unavailable')}
 const metadata=pack({name:body.name,type:body.type,size:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),scannedAt:new Date().toISOString()},'metadata:'+id)
 must(await client.from('iila_uploads').update({state:'ready',metadata_sealed:metadata}).eq('id',id).eq('owner_hash',owner))
 return {id}
}
export async function submit(client,req,body) {
 const owner=session(req);await limited(client,req,'submit')
 if(body.website)fail(400,'invalid_form')
 if(body.schemaVersion!==SCHEMA_VERSION||!UUID.test(body.requestId||'')||!Array.isArray(body.fileIds)||body.fileIds.length>MAX_FILES||new Set(body.fileIds).size!==body.fileIds.length||body.fileIds.some(id=>!UUID.test(id)))fail(400,'invalid_form')
 const data=cleanData(body.data||{}),errors=validate(data);if(Object.keys(errors).length)fail(400,'invalid_form')
 const reference='IILA-'+new Date().getUTCFullYear()+'-'+crypto.randomBytes(8).toString('hex').toUpperCase()
 const id=body.requestId
 const sealed=pack({answers:data,schemaVersion:SCHEMA_VERSION,privacyVersion:process.env.INTAKE_PRIVACY_VERSION,receivedAt:new Date().toISOString()},'case:'+id)
 const result=must(await client.rpc('iila_submit',{p_id:id,p_reference:reference,p_owner:owner,p_sealed:sealed,p_files:body.fileIds,p_risk:data.securityRisk!=='no',p_language:body.language==='fa'?'fa':'en'}))
 // An accepted case remains durable if SMTP is temporarily unavailable.
 try{await notify(client,id,result)}catch{}
 return {reference:result}
}
export async function notify(client,id,reference) {
 const transport=nodemailer.createTransport({host:'smtp.hostinger.com',port:465,secure:true,auth:{user:'info@iila-swiss.org',pass:process.env.INTAKE_SMTP_PASSWORD},tls:{rejectUnauthorized:true},connectionTimeout:8000,socketTimeout:10000})
 try {
  await transport.sendMail({from:'IILA Intake <info@iila-swiss.org>',to:'info@iila-swiss.org',subject:'IILA intake: '+reference,text:'A new confidential request has been received.\nReference: '+reference+'\n\nOpen the authenticated IILA staff portal:\nhttps://iila-swiss.org/intake-admin\n\nNo case information or attachments are included in this notification.',disableFileAccess:true,disableUrlAccess:true,headers:{'Auto-Submitted':'auto-generated'}})
  must(await client.from('iila_cases').update({notified_at:new Date().toISOString()}).eq('id',id))
 }finally{transport.close()}
}
export async function admin(client,req,body) {
 const actor=await staff(req,client)
 if(body.operation==='list'){
  await audit(client,actor,'case_list')
  return {cases:must(await client.from('iila_cases').select('id,reference,created_at,status,high_risk,notified_at').order('created_at',{ascending:false}).limit(100))}
 }
 if(!UUID.test(body.id||''))fail(400,'invalid_request')
 const row=must(await client.from('iila_cases').select('*').eq('id',body.id).single())
 if(body.operation==='detail'){
  await audit(client,actor,'case_read',row.id)
  const uploads=must(await client.from('iila_uploads').select('id,metadata_sealed').eq('case_id',row.id).eq('state','attached'))
  return {case:{id:row.id,reference:row.reference,status:row.status,verified_at:row.verified_at,high_risk:row.high_risk,...unpack(row.payload_sealed,'case:'+row.id),notes:row.notes_sealed?unpack(row.notes_sealed,'notes:'+row.id):'',files:uploads.map(f=>({id:f.id,...unpack(f.metadata_sealed,'metadata:'+f.id)}))}}
 }
 if(body.operation==='update'){
  if(!STATUSES.includes(body.status)||typeof body.notes!=='string'||body.notes.length>12000)fail(400,'invalid_request')
  await audit(client,actor,'case_update',row.id)
  must(await client.from('iila_cases').update({status:body.status,notes_sealed:pack(body.notes,'notes:'+row.id),...(body.status==='verified'&&!row.verified_at?{verified_at:new Date().toISOString()}:{})}).eq('id',row.id))
  return {ok:true}
 }
 if(body.operation==='retry_notification'){
  await audit(client,actor,'notification_retry',row.id)
  await notify(client,row.id,row.reference);return {ok:true}
 }
 if(body.operation==='download'){
  if(!UUID.test(body.fileId||''))fail(400,'invalid_request')
  const upload=must(await client.from('iila_uploads').select('*').eq('id',body.fileId).eq('case_id',row.id).eq('state','attached').single())
  await audit(client,actor,'evidence_download',row.id)
  const blob=must(await client.storage.from('iila-evidence').download(upload.id+'.enc'))
  const bytes=decrypt(Buffer.from(await blob.arrayBuffer()),key(),'evidence:'+upload.id)
  return {download:bytes}
 }
 fail(400,'invalid_request')
}
export {issueSession,hmac}
