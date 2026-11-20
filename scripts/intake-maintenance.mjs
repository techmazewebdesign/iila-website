// Explicit operator job. Dry-run by default. Submitted cases never expire automatically.
import {db,notify} from '../server/intake/service.mjs'
const client=db(), apply=process.argv.includes('--apply')
const must=r=>{if(r.error)throw new Error('Maintenance failed');return r.data}
const pending=must(await client.from('iila_cases').select('id,reference').is('notified_at',null).limit(100))
const drafts=must(await client.from('iila_uploads').select('id').is('case_id',null).lt('created_at',new Date(Date.now()-86400000).toISOString()).limit(100))
console.log(JSON.stringify({mode:apply?'apply':'dry-run',pendingNotifications:pending.length,abandonedUploads:drafts.length}))
if(apply){
 for(const row of pending)try{await notify(client,row.id,row.reference)}catch{console.error('Notification remains pending')}
 for(const f of drafts){
  must(await client.storage.from('iila-evidence').remove([f.id+'.enc']))
  must(await client.from('iila_uploads').delete().eq('id',f.id).is('case_id',null))
 }
 must(await client.from('iila_rates').delete().lt('window_start',new Date(Date.now()-2*86400000).toISOString()))
}
