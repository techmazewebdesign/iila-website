import {useState,useEffect,useRef} from 'react'
import {initializeApp,getApps} from '@firebase/app'
import {initializeAuth,inMemoryPersistence,signInWithEmailAndPassword,signOut,getMultiFactorResolver,TotpMultiFactorGenerator,multiFactor,sendEmailVerification,sendPasswordResetEmail,reload} from '@firebase/auth'
import {sections} from '../intake/schema'
import {staffErrorMessage,staffRequestError} from '../intake/staff-errors'
import {normalizeTotpCode,enrollmentExpired} from '../intake/totp'
import {useLanguage} from '../context/LanguageContext'
import './intake.css'
const statusLabels={received:['Received','دریافت شده'],awaiting_review:['Awaiting review','در انتظار بررسی'],legal_review:['Legal review','بررسی حقوقی'],needs_evidence:['Needs evidence','نیازمند مدرک'],documenting:['Documenting','تکمیل مستندات'],ready_for_decision:['Ready for decision','آماده تصمیم‌گیری'],verified:['Verification completed','بررسی و تأیید اطلاعات انجام شد'],referred:['Referred','ارجاع شده'],closed:['Closed','مختومه']}
const statuses=['received','awaiting_review','legal_review','needs_evidence','documenting','ready_for_decision','verified','referred','closed']
export default function IntakeAdmin(){
 const {lang}=useLanguage(),fa=lang==='fa',tr=(a,b)=>fa?b:a
 const client=useRef(null),token=useRef(null),idle=useRef(null)
 const secret=useRef(null)
 const [setupMessage,setSetupMessage]=useState(''),[setupQR,setSetupQR]=useState('')
 const [state,setState]=useState('loading'),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[otp,setOtp]=useState(''),[factor,setFactor]=useState(null),[cases,setCases]=useState([]),[selected,setSelected]=useState(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[search,setSearch]=useState('')
 const api=async body=>{
  const r=await fetch('/api/intake?action=admin',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token.current},body:JSON.stringify(body),cache:'no-store'})
  if(!r.ok){const problem=await r.json().catch(()=>({}));throw staffRequestError(r.status,problem.code)}
  if(body.operation==='download')return r.blob()
  return r.json()
 }
 const logout=async()=>{secret.current=null;setSetupQR('');setSetupMessage('');setFactor(null);token.current=null;setCases([]);setSelected(null);setState('login');setPassword('');setOtp('');if(client.current)await signOut(client.current)}
 useEffect(()=>{
  fetch('/api/intake?action=config',{cache:'no-store'}).then(r=>r.json()).then(c=>{
   if(!c.firebaseConfig){setState('unconfigured');return}
   const app=getApps().find(a=>a.name==='iila-staff')||initializeApp(c.firebaseConfig,'iila-staff');client.current=initializeAuth(app,{persistence:inMemoryPersistence});setState('login')
  }).catch(()=>setState('unconfigured'))
 },[])
 useEffect(()=>{
  if(!['ready','verify-email','enroll'].includes(state))return
  const reset=()=>{clearTimeout(idle.current);idle.current=setTimeout(logout,10*60*1000)}
  reset();window.addEventListener('pointerdown',reset);window.addEventListener('keydown',reset)
  return()=>{clearTimeout(idle.current);window.removeEventListener('pointerdown',reset);window.removeEventListener('keydown',reset)}
 },[state])
 useEffect(()=>{
  if(state!=='enroll'||!setupQR||!secret.current)return
  const deadline=secret.current.enrollmentCompletionDeadline
  const expire=()=>{secret.current=null;setSetupQR('');setOtp('');setSetupMessage('');setError(staffErrorMessage({code:'staff/totp-setup-expired'},fa))}
  if(enrollmentExpired(deadline)){expire();return}
  const timer=setTimeout(expire,Math.min(Date.parse(deadline)-Date.now(),2147483647))
  return()=>clearTimeout(timer)
 },[state,setupQR,fa])
 const run=async action=>{setBusy(true);setError('');try{await action()}catch(problem){setError(staffErrorMessage(problem,fa))}finally{setBusy(false)}}
 const setupStatus=async()=>{
  const user=client.current.currentUser
  await reload(user);token.current=await user.getIdToken(true)
  const r=await fetch('/api/intake?action=staff-setup',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token.current},body:'{}',cache:'no-store'})
  if(!r.ok){const problem=await r.json().catch(()=>({}));await logout();throw staffRequestError(r.status,problem.code)}
  const status=await r.json()
  if(!status.emailVerified){setState('verify-email');return}
  if(status.totpEnrolled){await logout();setSetupMessage(tr('Authenticator is enabled. Sign in again to complete the authenticator challenge.','رمزساز فعال است. دوباره وارد شوید تا تأیید رمزساز انجام شود.'));return}
  setState('enroll')
 }
 const resetPassword=()=>run(async()=>{
  if(!email.trim())throw Object.assign(new Error('Email required'),{code:'staff/email-required'})
  await sendPasswordResetEmail(client.current,email.trim())
  setSetupMessage(tr('If this email has an IILA staff account, a password setup/reset link has been sent. Check your inbox and spam folder.','اگر این ایمیل حساب کارکنان انجمن داشته باشد، پیوند تنظیم یا بازنشانی رمز ارسال شده است. صندوق ورودی و هرزنامه را بررسی کنید.'))
 })
 const sendVerification=()=>run(async()=>{
  await sendEmailVerification(client.current.currentUser)
  setSetupMessage(tr('Verification email sent. Open its link, then return here.','ایمیل تأیید ارسال شد. پیوند آن را باز کنید و سپس اینجا برگردید.'))
 })
 const prepareAuthenticator=()=>run(async()=>{
  secret.current=null;setSetupQR('');setOtp('');setSetupMessage('')
  const user=client.current.currentUser,session=await multiFactor(user).getSession()
  const candidate=await TotpMultiFactorGenerator.generateSecret(session)
  if(enrollmentExpired(candidate.enrollmentCompletionDeadline))throw Object.assign(new Error('Setup expired'),{code:'staff/totp-setup-expired'})
  // QR is rendered in this browser. The secret is never sent to a QR service.
  const {default:QRCode}=await import('qrcode')
  const qr=await QRCode.toDataURL(candidate.generateQrCodeUrl(user.email,'IILA Confidential Intake'),{width:240,margin:3,errorCorrectionLevel:'M'})
  secret.current=candidate;setSetupQR(qr)
 })
 const copySetupKey=()=>run(async()=>{
  if(!secret.current||enrollmentExpired(secret.current.enrollmentCompletionDeadline))throw Object.assign(new Error('Setup expired'),{code:'staff/totp-setup-expired'})
  await navigator.clipboard.writeText(secret.current.secretKey)
  setSetupMessage(tr('Setup key copied. Paste it into your authenticator app.','کلید تنظیم کپی شد. آن را در برنامه رمزساز وارد کنید.'))
 })
 const enroll=async e=>{e.preventDefault();await run(async()=>{
  if(!secret.current||enrollmentExpired(secret.current.enrollmentCompletionDeadline))throw Object.assign(new Error('Setup expired'),{code:'staff/totp-setup-expired'})
  const assertion=TotpMultiFactorGenerator.assertionForEnrollment(secret.current,normalizeTotpCode(otp))
  await multiFactor(client.current.currentUser).enroll(assertion,'IILA staff authenticator')
  await logout();setSetupMessage(tr('Authenticator enrolled. Sign in again with your password and authenticator code.','برنامه رمزساز فعال شد. با رمز عبور و کد رمزساز دوباره وارد شوید.'))
 })}
 const login=async e=>{e.preventDefault();await run(async()=>{
  try{
   await signInWithEmailAndPassword(client.current,email.trim(),password)
   await setupStatus()
  }catch(err){
   if(err.code!=='auth/multi-factor-auth-required')throw err
   const resolver=getMultiFactorResolver(client.current,err)
   const index=resolver.hints.findIndex(h=>h.factorId===TotpMultiFactorGenerator.FACTOR_ID)
   if(index<0)throw Object.assign(new Error('Authenticator required'),{code:'staff/mfa-required'})
   setFactor({resolver,index});setState('mfa')
  }finally{setPassword('')}
 })}
 const verify=async e=>{e.preventDefault();await run(async()=>{
  const hint=factor.resolver.hints[factor.index]
  const assertion=TotpMultiFactorGenerator.assertionForSignIn(hint.uid,normalizeTotpCode(otp))
  const credential=await factor.resolver.resolveSignIn(assertion);setOtp('');setFactor(null)
  token.current=await credential.user.getIdToken()
  try{const result=await api({operation:'list'});setCases(result.cases);setState('ready')}catch(problem){await logout();throw problem}
 })}
 const detail=id=>run(async()=>setSelected((await api({operation:'detail',id})).case))
 const download=file=>run(async()=>{
  const blob=await api({operation:'download',id:selected.id,fileId:file.id})
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='IILA-'+file.id+(file.type==='image/png'?'.png':'.jpg');a.click();URL.revokeObjectURL(url)
 })
 return <section className="intake-page intake-admin"><h1 className="text-3xl mb-6">{tr('Confidential intake · staff portal','درخواست‌های محرمانه · پرتال کارکنان')}</h1><p className="intake-help">{tr('Designated staff only. Multi-factor authentication is required. Sessions stay in memory and expire after 10 minutes of inactivity. Access and downloads are audited.','فقط کارکنان تعیین‌شده. احراز هویت دومرحله‌ای اجباری است. نشست فقط در حافظه نگهداری و پس از ۱۰ دقیقه عدم فعالیت بسته می‌شود. دسترسی و دانلود ثبت می‌شود.')}</p>
 {state==='loading'&&<p>{tr('Loading…','در حال بارگذاری…')}</p>}
 {state==='unconfigured'&&<p className="intake-banner">{tr('Staff access is awaiting secure backend configuration. No cases can be collected or viewed.','دسترسی کارکنان در انتظار تنظیمات امن است. دریافت یا مشاهده پرونده ممکن نیست.')}</p>}
 {state==='login'&&<form onSubmit={login}><label>{tr('Staff email','ایمیل کارکنان')}<input type="email" required autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>{tr('Password','رمز عبور')}<input type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></label><button disabled={busy}>{tr('Sign in','ورود')}</button><button type="button" disabled={busy} onClick={resetPassword}>{tr('Set or reset portal password','تنظیم یا بازنشانی رمز پرتال')}</button><p className="intake-help">{tr('Use the password you created for the IILA staff portal. Your Gmail or mailbox password does not sign you into this portal.','از رمزی که برای پرتال کارکنان انجمن ساخته‌اید استفاده کنید. رمز جیمیل یا صندوق ایمیل برای ورود به این پرتال نیست.')}</p></form>}
 {state==='verify-email'&&<div><h2>{tr('Verify your staff email','ایمیل کارکنان را تأیید کنید')}</h2><p>{tr('Verify ownership of your email before setting up your authenticator.','پیش از تنظیم رمزساز، مالکیت ایمیل را تأیید کنید.')}</p><button disabled={busy} onClick={sendVerification}>{tr('Send verification email','ارسال ایمیل تأیید')}</button><button disabled={busy} onClick={()=>run(setupStatus)}>{tr('I verified my email','ایمیلم را تأیید کردم')}</button><button onClick={logout}>{tr('Sign out','خروج')}</button></div>}
 {state==='enroll'&&<div><h2>{tr('Set up your authenticator','تنظیم برنامه رمزساز')}</h2>
  <p>{tr('Open Google Authenticator or Microsoft Authenticator on your phone. Add a new account by scanning the QR code below. Keep the QR code and setup key private.','Google Authenticator یا Microsoft Authenticator را در تلفن باز کنید. با اسکن کد زیر حساب جدیدی اضافه کنید. کد و کلید تنظیم را محرمانه نگه دارید.')}</p>
  {!secret.current?<button disabled={busy} onClick={prepareAuthenticator}>{tr('Generate authenticator setup','ایجاد تنظیمات رمزساز')}</button>:<>
   {setupQR&&<img src={setupQR} alt={tr('Private authenticator setup QR code','کد خصوصی تنظیم برنامه رمزساز')} width="240" height="240" className="intake-auth-qr"/>}
   <p className="intake-help">{tr('Use the new entry labelled IILA Confidential Intake. Wait for a fresh six-digit code, then enter it below.','از حساب جدید با نام IILA Confidential Intake استفاده کنید. منتظر کد شش‌رقمی جدید بمانید و آن را در پایین وارد کنید.')}</p>
   <details><summary>{tr('Enter setup key manually instead','وارد کردن دستی کلید تنظیم')}</summary><label>{tr('Private setup key','کلید محرمانه تنظیم')}<input readOnly autoComplete="off" dir="ltr" value={secret.current.secretKey}/></label><button type="button" disabled={busy} onClick={copySetupKey}>{tr('Copy setup key','کپی کلید تنظیم')}</button><p className="intake-help">{tr('Choose time-based codes. Digits: ','رمز مبتنی بر زمان را انتخاب کنید. تعداد رقم: ')}{secret.current.codeLength}{tr(' · Interval (seconds): ',' · دوره (ثانیه): ')}{secret.current.codeIntervalSeconds}{' · '}{secret.current.hashingAlgorithm}</p></details>
   <form onSubmit={enroll}><label>{tr('Six-digit authenticator code','کد شش‌رقمی رمزساز')}<input value={otp} onChange={e=>setOtp(normalizeTotpCode(e.target.value))} inputMode="numeric" pattern="[0-9]{6}" autoComplete="one-time-code" dir="ltr" required/></label><button disabled={busy}>{tr('Enable authenticator','فعال‌سازی رمزساز')}</button></form>
   <p className="intake-help">{tr('If you start a new setup, scan its new QR code into your authenticator. Codes from an earlier setup will not work.','اگر تنظیم جدیدی ایجاد کنید، کد جدید آن را در رمزساز اسکن کنید. رمزهای تنظیم قبلی کار نمی‌کنند.')}</p><button type="button" disabled={busy} onClick={prepareAuthenticator}>{tr('Start new authenticator setup','شروع تنظیم جدید رمزساز')}</button>
  </>}
  {setupMessage&&<p role="status">{setupMessage}</p>}<button onClick={logout}>{tr('Sign out','خروج')}</button>
 </div>}
 {setupMessage&&state!=='enroll'&&<p role="status">{setupMessage}</p>}
 {state==='mfa'&&<form onSubmit={verify}><label>{tr('Authenticator code','کد برنامه رمزساز')}<input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required value={otp} onChange={e=>setOtp(normalizeTotpCode(e.target.value))}/></label><button disabled={busy}>{tr('Verify MFA','تأیید دومرحله‌ای')}</button><button type="button" onClick={logout}>{tr('Sign out','خروج')}</button></form>}
 {state==='ready'&&<><button onClick={logout}>{tr('Sign out','خروج')}</button><label>{tr('Search loaded cases by reference, date or status','جست‌وجوی کد، تاریخ یا وضعیت در پرونده‌های بارگذاری‌شده')}<input value={search} onChange={e=>setSearch(e.target.value)}/></label><p className="intake-help">{tr('Latest 100 cases. Internal statuses do not imply court acceptance.','۱۰۰ پرونده اخیر. وضعیت داخلی به معنای پذیرش قضایی نیست.')}</p><table><thead><tr><th>{tr('Reference','کد')}</th><th>{tr('Date','تاریخ')}</th><th>{tr('Status','وضعیت')}</th><th>{tr('Notification','اعلان')}</th></tr></thead><tbody>{cases.filter(c=>(c.reference+' '+c.created_at+' '+c.status).toLowerCase().includes(search.toLowerCase())).map(c=><tr key={c.id}><td><button disabled={busy} onClick={()=>detail(c.id)}>{c.reference}{c.high_risk?' ⚑':''}</button></td><td>{new Date(c.created_at).toLocaleDateString(lang)}</td><td>{statusLabels[c.status]?.[fa?1:0]||c.status}</td><td>{c.notified_at?tr('Sent','ارسال شده'):tr('Pending','در انتظار')}</td></tr>)}</tbody></table>
 {selected&&<article><h2 className="text-2xl mb-6">{selected.reference}</h2>{selected.high_risk&&<p className="intake-banner">{tr('Additional confidentiality precautions required.','رعایت احتیاط‌های محرمانگی بیشتر لازم است.')}</p>}<dl className="intake-review">{sections.flatMap(s=>s.fields).filter(f=>selected.answers[f.name]!==undefined).map(f=><div key={f.name}><dt>{fa?f.fa:f.en}</dt><dd>{JSON.stringify(selected.answers[f.name])}</dd></div>)}</dl><p className="intake-help">{tr('Cases and evidence have no automatic expiry. Verification does not automatically delete them.','پرونده‌ها و مدارک انقضای خودکار ندارند. تأیید اطلاعات موجب حذف خودکار نمی‌شود.')}</p>{selected.verified_at&&<p>{tr('First verified: ','نخستین تأیید: ')}{new Date(selected.verified_at).toLocaleString(lang)}</p>}<p>{tr('Evidence originals (download only; never opened inline)','اصل مدارک (فقط دانلود؛ بدون نمایش در مرورگر)')}</p>{selected.files.map(f=><button disabled={busy} key={f.id} onClick={()=>download(f)}>{f.type} · {Math.ceil(f.size/1024)} KB · {f.sha256.slice(0,12)}…</button>)}<label>{tr('Internal status','وضعیت داخلی')}<select value={selected.status} onChange={e=>setSelected({...selected,status:e.target.value})}>{statuses.map(s=><option key={s} value={s}>{statusLabels[s]?.[fa?1:0]||s}</option>)}</select></label><label>{tr('Confidential notes','یادداشت محرمانه')}<textarea maxLength={12000} value={selected.notes} onChange={e=>setSelected({...selected,notes:e.target.value})}/></label><button disabled={busy} onClick={()=>run(async()=>{await api({operation:'update',id:selected.id,status:selected.status,notes:selected.notes});setCases((await api({operation:'list'})).cases)})}>{tr('Save review','ذخیره بررسی')}</button><button disabled={busy} onClick={()=>run(async()=>{await api({operation:'retry_notification',id:selected.id});setCases((await api({operation:'list'})).cases)})}>{tr('Retry reference-only notification','تلاش مجدد اعلان فقط با کد')}</button></article>}</>}
 {error&&<p className="intake-error" role="alert">{error}</p>}
 </section>
}
