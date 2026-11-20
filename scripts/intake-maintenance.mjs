// Explicit operator job. Dry-run by default; schedule only after retention/backup approval.
import {db,notify,audit} from '../server/intake/service.mjs'
const client=db(), apply=process.argv.includes('--apply'), actor='00000000-0000-0000-0000-000000000000'
const must=r=>{if(r.error)throw new Error('Maintenance failed');return r.data}
const pending=must(await client.from('iila_cases').select('id,reference').is('notified_at',null).limit(100))
const expired=must(await client.from('iila_cases').select('id').lt('delete_after',new Date().toISOString()).eq('legal_hold',false).limit(100))
const drafts=must(await client.from('iila_uploads').select('id').is('case_id',null).lt('created_at',new Date(Date.now()-86400000).toISOString()).limit(100))
console.log(JSON.stringify({mode:apply?'apply':'dry-run',pendingNotifications:pending.length,expiredCases:expired.length,abandonedUploads:drafts.length}))
if(apply){
 for(const row of pending)try{await notify(client,row.id,row.reference)}catch{console.error('Notification remains pending')}
 for(const row of expired){
  const files=must(await client.from('iila_uploads').select('id').eq('case_id',row.id))
  if(files.length)must(await client.storage.from('iila-evidence').remove(files.map(f=>f.id+'.enc')))
  await audit(client,actor,'retention_delete',row.id)
  must(await client.from('iila_cases').delete().eq('id',row.id).eq('legal_hold',false))
 }
 for(const f of drafts){
  must(await client.storage.from('iila-evidence').remove([f.id+'.enc']))
  must(await client.from('iila_uploads').delete().eq('id',f.id).is('case_id',null))
 }
 must(await client.from('iila_rates').delete().lt('window_start',new Date(Date.now()-2*86400000).toISOString()))
}
