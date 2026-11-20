import crypto from 'node:crypto'
import tls from 'node:tls'
export const fail=(status,code)=>{throw Object.assign(new Error(code),{status,code})}
export function encrypt(value,keyHex,context) {
 const key=Buffer.from(keyHex||'','hex');if(key.length!==32)fail(503,'unavailable')
 const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',key,iv)
 cipher.setAAD(Buffer.from(context))
 const ciphertext=Buffer.concat([cipher.update(Buffer.isBuffer(value)?value:Buffer.from(JSON.stringify(value))),cipher.final()])
 return Buffer.concat([Buffer.from([1]),iv,cipher.getAuthTag(),ciphertext])
}
export function decrypt(blob,keyHex,context) {
 const b=Buffer.from(blob);if(b[0]!==1||b.length<30)fail(500,'unavailable')
 const decipher=crypto.createDecipheriv('aes-256-gcm',Buffer.from(keyHex,'hex'),b.subarray(1,13))
 decipher.setAAD(Buffer.from(context));decipher.setAuthTag(b.subarray(13,29))
 return Buffer.concat([decipher.update(b.subarray(29)),decipher.final()])
}
export function hmac(value,key=process.env.INTAKE_SESSION_KEY) {
 if(!key||key.length<64)fail(503,'unavailable')
 return crypto.createHmac('sha256',key).update(value).digest('hex')
}
export function equal(a,b) {
 return typeof a==='string'&&typeof b==='string'&&a.length===b.length&&crypto.timingSafeEqual(Buffer.from(a),Buffer.from(b))
}
export function issueSession(now=Date.now()) {
 const value=crypto.randomBytes(32).toString('hex')+'.'+(now+60*60*1000)
 return value+'.'+hmac(value)
}
export function verifySession(cookie,now=Date.now()) {
 const match=/(?:^|;\s*)__Host-iila-intake=([^;]+)/.exec(cookie||'')
 const token=match?.[1];if(!token)fail(403,'session_expired')
 const parts=token.split('.');if(parts.length!==3||!/^[a-f0-9]{64}$/.test(parts[0])||!/^\d{13}$/.test(parts[1]))fail(403,'session_expired')
 const value=parts[0]+'.'+parts[1]
 if(!equal(parts[2],hmac(value))||Number(parts[1])<now)fail(403,'session_expired')
 return token
}
export function validateFile({name,type,base64}) {
 if(typeof name!=='string'||name.length>200||typeof base64!=='string'||base64.length>4194304||base64.length%4!==0||!/^[A-Za-z0-9+/]*={0,2}$/.test(base64))fail(400,'invalid_image')
 const bytes=Buffer.from(base64,'base64')
 if(!bytes.length||bytes.length>3*1024*1024||bytes.toString('base64')!==base64)fail(413,'invalid_image')
 const png=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
 const jpg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255
 if(!((type==='image/png'&&png&&/\.png$/i.test(name))||(type==='image/jpeg'&&jpg&&/\.jpe?g$/i.test(name))))fail(400,'invalid_image')
 return bytes
}
export async function clam(bytes=null) {
 const host=process.env.INTAKE_CLAMAV_HOST,port=Number(process.env.INTAKE_CLAMAV_PORT||3310)
 if(!host)fail(503,'scanner_unavailable')
 return new Promise((resolve,reject)=>{
  const socket=tls.connect({host,port,servername:host,rejectUnauthorized:true,cert:process.env.INTAKE_CLAMAV_CLIENT_CERT,key:process.env.INTAKE_CLAMAV_CLIENT_KEY,...(process.env.INTAKE_CLAMAV_CA?{ca:process.env.INTAKE_CLAMAV_CA}:{})}), chunks=[]
  const done=err=>{socket.destroy();err?reject(Object.assign(new Error('scanner_unavailable'),{status:503,code:'scanner_unavailable'})):resolve(true)}
  socket.setTimeout(8000,()=>done(true))
  socket.on('error',()=>done(true))
  socket.on('secureConnect',()=>{
   if(!bytes){socket.write('zPING\0');return}
   socket.write('zINSTREAM\0')
   for(let n=0;n<bytes.length;n+=65536){const piece=bytes.subarray(n,n+65536),length=Buffer.alloc(4);length.writeUInt32BE(piece.length);socket.write(length);socket.write(piece)}
   socket.write(Buffer.alloc(4))
  })
  socket.on('data',chunk=>{
   chunks.push(chunk);const output=Buffer.concat(chunks).toString()
   if(output.length>1024){done(true);return}
   if(!output.includes('\0')&&!output.includes('\n'))return
   socket.destroy()
   if(!bytes&&output.trim().replace(/\0/g,'')==='PONG')resolve(true)
   else if(bytes&&/^stream: OK(?:\0|\n)$/.test(output))resolve(true)
   else if(output.includes('FOUND'))reject(Object.assign(new Error('unsafe_image'),{status:400,code:'unsafe_image'}))
   else done(true)
  })
  socket.on('end',()=>{if(!socket.destroyed)done(true)})
 })
}
