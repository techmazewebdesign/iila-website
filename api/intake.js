import {configured,ready,db,origin,limited,session,issueSession,hmac,upload,submit,admin,setupStaff} from '../server/intake/service.mjs'
export const config={maxDuration:60,api:{bodyParser:{sizeLimit:'4300kb'}}}
export default async function handler(req,res) {
 res.setHeader('Cache-Control','no-store, max-age=0')
 res.setHeader('Pragma','no-cache')
 res.setHeader('X-Content-Type-Options','nosniff')
 res.setHeader('Referrer-Policy','no-referrer')
 res.setHeader('X-Robots-Tag','noindex, nofollow, noarchive')
 const action=req.query?.action||new URL(req.url,'https://iila-swiss.org').searchParams.get('action')
 try {
  if(req.method==='GET'&&action==='config') {
   const active=configured()?await ready():false
   return res.status(200).json({active,firebaseConfig:process.env.INTAKE_FIREBASE_PROJECT_ID&&process.env.INTAKE_FIREBASE_API_KEY?{projectId:process.env.INTAKE_FIREBASE_PROJECT_ID,apiKey:process.env.INTAKE_FIREBASE_API_KEY,authDomain:process.env.INTAKE_FIREBASE_AUTH_DOMAIN}:null})
  }
  if(req.method!=='POST'){res.setHeader('Allow','GET, POST');return res.status(405).json({code:'method_not_allowed'})}
  origin(req)
  if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||''))return res.status(415).json({code:'invalid_request'})
  const body=req.body
  if(!body||typeof body!=='object'||Array.isArray(body))return res.status(400).json({code:'invalid_request'})
  if(Buffer.byteLength(JSON.stringify(body))>4300*1024)return res.status(413).json({code:'invalid_request'})
  if(action==='staff-setup'){
   if(!/^Bearer .+$/.test(req.headers.authorization||''))return res.status(401).json({code:'unauthorised'})
   const client=db(),status=await setupStaff(req,client)
   await limited(client,req,'staff-setup')
   return res.status(200).json(status)
  }
  if(action==='admin'){
   const result=await admin(db(),req,body)
   if(result.download){res.setHeader('Content-Type','application/octet-stream');res.setHeader('Content-Disposition','attachment; filename="IILA-evidence-original.bin"');return res.status(200).send(result.download)}
   return res.status(200).json(result)
  }
  if(!configured())return res.status(503).json({code:'unavailable'})
  const client=db()
  if(action==='session'){
   await limited(client,req,'session')
   const token=issueSession()
   res.setHeader('Set-Cookie','__Host-iila-intake='+token+'; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600')
   return res.status(200).json({csrf:hmac('csrf:'+token)})
  }
  if(action==='upload')return res.status(200).json(await upload(client,req,body))
  if(action==='submit')return res.status(200).json(await submit(client,req,body))
  return res.status(404).json({code:'not_found'})
 } catch(error) {
  // Never log request bodies, filenames, tokens, email addresses or incident details.
  const status=Number.isInteger(error.status)?error.status:503
  return res.status(status).json({code:error.code||'unavailable'})
 }
}
