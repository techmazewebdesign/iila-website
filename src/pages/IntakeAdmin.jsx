import {useState,useEffect,useRef} from 'react'
import {createClient} from '@supabase/supabase-js'
import {sections} from '../intake/schema'
import {useLanguage} from '../context/LanguageContext'
import './intake.css'
const statuses=['received','awaiting_review','legal_review','needs_evidence','documenting','ready_for_decision','referred','closed']
export default function IntakeAdmin(){
 const {lang}=useLanguage(),fa=lang==='fa',tr=(a,b)=>fa?b:a
 const client=useRef(null),token=useRef(null),idle=useRef(null)
 const [state,setState]=useState('loading'),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[otp,setOtp]=useState(''),[factor,setFactor]=useState(null),[cases,setCases]=useState([]),[selected,setSelected]=useState(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[search,setSearch]=useState('')
 const api=async body=>{
  const r=await fetch('/api/intake?action=admin',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token.current},body:JSON.stringify(body),cache:'no-store'})
  if(!r.ok)throw new Error('Access unavailable. Check your staff access and MFA, then sign in again.')
  if(body.operation==='download')return r.blob()
  return r.json()
 }
 const logout=async()=>{token.current=null;setCases([]);setSelected(null);setState('login');setPassword('');setOtp('');await client.current?.auth.signOut()}
 useEffect(()=>{
  fetch('/api/intake?action=config',{cache:'no-store'}).then(r=>r.json()).then(c=>{
   if(!c.supabaseUrl||!c.publishableKey){setState('unconfigured');return}
   client.current=createClient(c.supabaseUrl,c.publishableKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});setState('login')
  }).catch(()=>setState('unconfigured'))
 },[])
 useEffect(()=>{
  if(state!=='ready')return
  const reset=()=>{clearTimeout(idle.current);idle.current=setTimeout(logout,10*60*1000)}
  reset();window.addEventListener('pointerdown',reset);window.addEventListener('keydown',reset)
  return()=>{clearTimeout(idle.current);window.removeEventListener('pointerdown',reset);window.removeEventListener('keydown',reset)}
 },[state])
 const run=async action=>{setBusy(true);setError('');try{await action()}catch{setError(tr('Access or action unavailable. Check staff permissions and MFA; sign in again if needed.','دسترسی یا عملیات در دسترس نیست. مجوز و احراز هویت دومرحله‌ای را بررسی و در صورت نیاز دوباره وارد شوید.'))}finally{setBusy(false)}}
 const login=async e=>{e.preventDefault();await run(async()=>{
  const r=await client.current.auth.signInWithPassword({email,password});setPassword('')
  if(r.error)throw r.error
  const factors=await client.current.auth.mfa.listFactors();const f=factors.data?.totp?.find(x=>x.status==='verified')
  if(!f){await client.current.auth.signOut();setError(tr('A pre-enrolled authenticator and explicit staff authorisation are required. Contact the IILA administrator.','فعال‌سازی قبلی برنامه رمزساز و مجوز صریح کارکنان لازم است. با مدیر انجمن تماس بگیرید.'));return}
  setFactor(f.id);setState('mfa')
 })}
 const verify=async e=>{e.preventDefault();await run(async()=>{
  const r=await client.current.auth.mfa.challengeAndVerify({factorId:factor,code:otp});setOtp('');if(r.error)throw r.error
  const s=await client.current.auth.getSession();token.current=s.data.session?.access_token
  const result=await api({operation:'list'});setCases(result.cases);setState('ready')
 })}
 const detail=id=>run(async()=>setSelected((await api({operation:'detail',id})).case))
 const download=file=>run(async()=>{
  const blob=await api({operation:'download',id:selected.id,fileId:file.id})
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='IILA-'+file.id+(file.type==='image/png'?'.png':'.jpg');a.click();URL.revokeObjectURL(url)
 })
 return <section className="intake-page intake-admin"><h1 className="text-3xl mb-6">{tr('Confidential intake · staff portal','درخواست‌های محرمانه · پرتال کارکنان')}</h1><p className="intake-help">{tr('Designated staff only. Multi-factor authentication is required. Sessions stay in memory and expire after 10 minutes of inactivity. Access and downloads are audited.','فقط کارکنان تعیین‌شده. احراز هویت دومرحله‌ای اجباری است. نشست فقط در حافظه نگهداری و پس از ۱۰ دقیقه عدم فعالیت بسته می‌شود. دسترسی و دانلود ثبت می‌شود.')}</p>
 {state==='loading'&&<p>{tr('Loading…','در حال بارگذاری…')}</p>}
 {state==='unconfigured'&&<p className="intake-banner">{tr('Staff access is awaiting secure backend configuration. No cases can be collected or viewed.','دسترسی کارکنان در انتظار تنظیمات امن است. دریافت یا مشاهده پرونده ممکن نیست.')}</p>}
 {state==='login'&&<form onSubmit={login}><label>{tr('Staff email','ایمیل کارکنان')}<input type="email" required autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>{tr('Password','رمز عبور')}<input type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></label><button disabled={busy}>{tr('Sign in','ورود')}</button></form>}
 {state==='mfa'&&<form onSubmit={verify}><label>{tr('Authenticator code','کد برنامه رمزساز')}<input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required value={otp} onChange={e=>setOtp(e.target.value)}/></label><button disabled={busy}>{tr('Verify MFA','تأیید دومرحله‌ای')}</button><button type="button" onClick={logout}>{tr('Sign out','خروج')}</button></form>}
 {state==='ready'&&<><button onClick={logout}>{tr('Sign out','خروج')}</button><label>{tr('Search loaded cases by reference, date or status','جست‌وجوی کد، تاریخ یا وضعیت در پرونده‌های بارگذاری‌شده')}<input value={search} onChange={e=>setSearch(e.target.value)}/></label><p className="intake-help">{tr('Latest 100 cases. Internal statuses do not imply court acceptance.','۱۰۰ پرونده اخیر. وضعیت داخلی به معنای پذیرش قضایی نیست.')}</p><table><thead><tr><th>{tr('Reference','کد')}</th><th>{tr('Date','تاریخ')}</th><th>{tr('Status','وضعیت')}</th><th>{tr('Notification','اعلان')}</th></tr></thead><tbody>{cases.filter(c=>(c.reference+' '+c.created_at+' '+c.status).toLowerCase().includes(search.toLowerCase())).map(c=><tr key={c.id}><td><button disabled={busy} onClick={()=>detail(c.id)}>{c.reference}{c.high_risk?' ⚑':''}</button></td><td>{new Date(c.created_at).toLocaleDateString(lang)}</td><td>{c.status}</td><td>{c.notified_at?tr('Sent','ارسال شده'):tr('Pending','در انتظار')}</td></tr>)}</tbody></table>
 {selected&&<article><h2 className="text-2xl mb-6">{selected.reference}</h2>{selected.high_risk&&<p className="intake-banner">{tr('Additional confidentiality precautions required.','رعایت احتیاط‌های محرمانگی بیشتر لازم است.')}</p>}<dl className="intake-review">{sections.flatMap(s=>s.fields).filter(f=>selected.answers[f.name]!==undefined).map(f=><div key={f.name}><dt>{fa?f.fa:f.en}</dt><dd>{JSON.stringify(selected.answers[f.name])}</dd></div>)}</dl><p>{tr('Evidence originals (download only; never opened inline)','اصل مدارک (فقط دانلود؛ بدون نمایش در مرورگر)')}</p>{selected.files.map(f=><button disabled={busy} key={f.id} onClick={()=>download(f)}>{f.type} · {Math.ceil(f.size/1024)} KB · {f.sha256.slice(0,12)}…</button>)}<label>{tr('Internal status','وضعیت داخلی')}<select value={selected.status} onChange={e=>setSelected({...selected,status:e.target.value})}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label><label>{tr('Confidential notes','یادداشت محرمانه')}<textarea maxLength={12000} value={selected.notes} onChange={e=>setSelected({...selected,notes:e.target.value})}/></label><button disabled={busy} onClick={()=>run(async()=>{await api({operation:'update',id:selected.id,status:selected.status,notes:selected.notes});setCases((await api({operation:'list'})).cases)})}>{tr('Save review','ذخیره بررسی')}</button><button disabled={busy} onClick={()=>run(async()=>{await api({operation:'retry_notification',id:selected.id});setCases((await api({operation:'list'})).cases)})}>{tr('Retry reference-only notification','تلاش مجدد اعلان فقط با کد')}</button></article>}</>}
 {error&&<p className="intake-error" role="alert">{error}</p>}
 </section>
}
