// Run on the operator machine. Private keys never belong in the repository.
import fs from 'node:fs'
import path from 'node:path'
import {execFileSync} from 'node:child_process'
const [host,destination]=process.argv.slice(2)
if(!host||host.length>253||!host.split('.').every(label=>/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))||!host.includes('.')||!destination){console.error('Usage: node scripts/scanner-certificates.mjs scanner.example.org /protected/new-directory');process.exit(1)}
const dir=path.resolve(destination)
if(fs.existsSync(dir)){console.error('Refusing to overwrite an existing certificate directory.');process.exit(1)}
process.umask(0o077);fs.mkdirSync(dir,{mode:0o700})
const run=args=>execFileSync('openssl',args,{cwd:dir,stdio:'ignore'})
const key=name=>run(['genpkey','-algorithm','EC','-pkeyopt','ec_paramgen_curve:P-256','-out',name+'.key'])
key('ca')
run(['req','-x509','-new','-key','ca.key','-sha256','-days','3650','-subj','/CN=IILA Scanner Dedicated CA','-addext','basicConstraints=critical,CA:TRUE','-addext','keyUsage=critical,keyCertSign,cRLSign','-out','ca.pem'])
for(const [name,subject,purpose,san] of [['server',host,'serverAuth','DNS:'+host],['client','iila-intake-server','clientAuth',null]]){
 key(name);run(['req','-new','-key',name+'.key','-subj','/CN='+subject,'-out',name+'.csr'])
 fs.writeFileSync(path.join(dir,name+'.ext'),'basicConstraints=critical,CA:FALSE\nkeyUsage=critical,digitalSignature\nextendedKeyUsage='+purpose+'\n'+(san?'subjectAltName='+san+'\n':''),{mode:0o600})
 run(['x509','-req','-in',name+'.csr','-CA','ca.pem','-CAkey','ca.key','-CAcreateserial','-days','90','-sha256','-extfile',name+'.ext','-out',name+'.pem'])
}
fs.writeFileSync(path.join(dir,'client-trust.pem'),fs.readFileSync(path.join(dir,'ca.pem'))+fs.readFileSync(path.join(dir,'client.pem'),'utf8'),{mode:0o600})
console.log('Certificates created in the protected directory. Keep ca.key and client.key off the scanner host. Rotate leaf certificates before 90 days.')
