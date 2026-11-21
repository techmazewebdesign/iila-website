// Run only against IILA's dedicated private scanner. Sends fictional test bytes.
import fs from 'node:fs'
import {clam} from '../server/intake/security.mjs'
if(process.argv[2])Object.assign(process.env,JSON.parse(fs.readFileSync(process.argv[2],'utf8')))
try{
 await clam()
 await clam(Buffer.from('IILA fictional clean scanner test\n'))
 let blocked=false
 try{await clam(Buffer.from('WDVPIVAlQEFQWzRcUFpYNTQoUF4pN0NDKTd9JEVJQ0FSLVNUQU5EQVJELUFOVElWSVJVUy1URVNULUZJTEUhJEgrSCo=','base64'))}catch(error){if(error.code==='unsafe_image')blocked=true;else throw error}
 if(!blocked)throw new Error('Malware test was accepted')
 const cert=process.env.INTAKE_CLAMAV_CLIENT_CERT,key=process.env.INTAKE_CLAMAV_CLIENT_KEY
 delete process.env.INTAKE_CLAMAV_CLIENT_CERT;delete process.env.INTAKE_CLAMAV_CLIENT_KEY
 let anonymousRejected=false
 try{await clam()}catch{anonymousRejected=true}finally{process.env.INTAKE_CLAMAV_CLIENT_CERT=cert;process.env.INTAKE_CLAMAV_CLIENT_KEY=key}
 if(!anonymousRejected)throw new Error('Scanner accepted an unauthenticated client')
 console.log(JSON.stringify({scannerVerified:true,signaturesCurrent:true,cleanAccepted:true,eicarBlocked:true,anonymousRejected:true}))
}catch{console.error('Scanner activation refused: connection, certificate, signature freshness or malware-rejection check failed.');process.exitCode=1}
