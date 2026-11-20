import {useState,useEffect,useRef} from 'react'
import {Link} from 'react-router-dom'
import {ShieldCheck,ChevronRight,CheckCircle,Upload,LockKeyhole} from 'lucide-react'
import {useLanguage} from '../context/LanguageContext'
import {sections,visible,validate,SCHEMA_VERSION,MAX_FILE_BYTES,MAX_FILES} from '../intake/schema'
import './intake.css'

export default function HumanRightsComplaint() {
 const {lang,dir}=useLanguage(), fa=lang==='fa'
 const tr=(en,faText)=>fa?faText:en
 const [data,setData]=useState({}), [step,setStep]=useState(0), [errors,setErrors]=useState({})
 const [files,setFiles]=useState([]), [notice,setNotice]=useState(''), [config,setConfig]=useState(null)
 const [busy,setBusy]=useState(false), [progress,setProgress]=useState(''), [reference,setReference]=useState('')
 const session=useRef(null), requestId=useRef(crypto.randomUUID()), uploads=useRef(new Map()), heading=useRef(null)
 useEffect(()=>{fetch('/api/intake?action=config',{cache:'no-store'}).then(r=>r.json()).then(setConfig).catch(()=>setConfig({active:false}))},[])
 useEffect(()=>{document.title=tr('Human rights documentation & legal review | IILA','درخواست مستندسازی و بررسی حقوقی | IILA')},[lang])
 useEffect(()=>{heading.current?.focus()},[step])
 useEffect(()=>{
  const leave=e=>{if(Object.keys(data).length&&!reference){e.preventDefault();e.returnValue=''}}
  window.addEventListener('beforeunload',leave);return()=>window.removeEventListener('beforeunload',leave)
 },[data,reference])
 const countries=(()=>{try {const dn=new Intl.DisplayNames([fa?'fa':'en'],{type:'region'});return Array.from({length:26*26},(_,i)=>String.fromCharCode(65+Math.floor(i/26))+String.fromCharCode(65+i%26)).filter(c=>dn.of(c)!==c&&!['EU','UN','EZ','XA','XB','ZZ'].includes(c)).map(c=>dn.of(c)).sort((a,b)=>a.localeCompare(b,lang))}catch{return[]}})()
 const change=(name,value)=>{setData(d=>({...d,[name]:value}));setErrors(e=>({...e,[name]:undefined}))}
 const next=()=>{const e=validate(data,step);setErrors(e);if(!Object.keys(e).length){setStep(s=>s+1);setNotice('')}else setNotice(tr('Please complete the highlighted fields.','لطفاً موارد مشخص‌شده را کامل کنید.'))}
 const pick=selected=>{
  const incoming=Array.from(selected)
  if(files.length+incoming.length>MAX_FILES){setNotice(tr('Choose up to five images.','حداکثر پنج تصویر انتخاب کنید.'));return}
  if(incoming.some(f=>!['image/jpeg','image/png'].includes(f.type)||f.size>MAX_FILE_BYTES||!f.size)){setNotice(tr('Only JPG/PNG images up to 3 MB each are accepted.','فقط تصویر JPG یا PNG تا ۳ مگابایت پذیرفته می‌شود.'));return}
  setFiles(old=>[...old,...incoming]);setNotice('')
 }
 const api=async(action,body)=>{
  const r=await fetch('/api/intake?action='+action,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-CSRF-Token':session.current?.csrf||''},body:JSON.stringify(body)})
  const result=await r.json()
  if(!r.ok)throw new Error(result.code||'unavailable')
  return result
 }
 const submit=async()=>{
  const e=validate(data);if(Object.keys(e).length){setErrors(e);setStep(sections.findIndex(s=>s.fields.some(f=>e[f.name])));return}
  if(!config?.active||busy)return
  setBusy(true);setNotice('')
  try{
   if(!session.current)session.current=await api('session',{})
   const ids=[]
   for(let i=0;i<files.length;i++){
    const file=files[i];setProgress(tr('Checking and securely uploading image ','بررسی و بارگذاری امن تصویر ')+(i+1)+' / '+files.length)
    if(!uploads.current.has(file)){
     const encoded=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result).split(',')[1]);r.onerror=reject;r.readAsDataURL(file)})
     const item=await api('upload',{name:file.name,type:file.type,base64:encoded,uploadId:crypto.randomUUID()})
     uploads.current.set(file,item.id)
    }
    ids.push(uploads.current.get(file))
   }
   setProgress(tr('Saving your request…','در حال ثبت درخواست…'))
   const result=await api('submit',{data,fileIds:ids,requestId:requestId.current,schemaVersion:SCHEMA_VERSION,language:lang,website:''})
   setReference(result.reference);setData({});setFiles([]);session.current=null;uploads.current.clear()
  }catch(err){setNotice(tr('Your request has not been confirmed. Please try again later. Do not send sensitive evidence by email.','ثبت درخواست تأیید نشده است. لطفاً بعداً دوباره تلاش کنید. مدارک حساس را با ایمیل ارسال نکنید.'))}
  finally{setBusy(false);setProgress('')}
 }
 const field=f=>{
  if(!visible(f,data))return null
  const label=fa?f.fa:f.en, id='intake-'+f.name
  const attrs={id,name:f.name,'aria-invalid':!!errors[f.name],'aria-describedby':errors[f.name]?id+'-error':undefined}
  let input
  if(f.type==='checks')input=<fieldset><legend>{label}{f.required?' *':''}</legend><div className="intake-checks">{f.options.map(([value,en,persian])=><label key={value}><input type="checkbox" checked={(data[f.name]||[]).includes(value)} onChange={e=>change(f.name,e.target.checked?[...(data[f.name]||[]),value]:(data[f.name]||[]).filter(v=>v!==value))}/><span>{fa?persian:en}</span></label>)}</div></fieldset>
  else if(f.type==='consent')input=<label className="intake-consent"><input {...attrs} type="checkbox" checked={data[f.name]===true} onChange={e=>change(f.name,e.target.checked)}/><span>{label} *</span></label>
  else input=<><label htmlFor={id}>{label}{f.required?' *':''}</label>{f.type==='select'?<select {...attrs} value={data[f.name]||''} onChange={e=>change(f.name,e.target.value)}><option value="">{tr('Select…','انتخاب کنید…')}</option>{f.options.map(([v,en,p])=><option key={v} value={v}>{fa?p:en}</option>)}</select>:f.type==='textarea'?<textarea {...attrs} rows={f.name==='incidentDescription'?8:4} maxLength={12000} value={data[f.name]||''} onChange={e=>change(f.name,e.target.value)}/>:<input {...attrs} type={f.type==='country'?'text':f.type} list={f.type==='country'?'intake-countries':undefined} maxLength={500} autoComplete="off" dir={['email','tel','date'].includes(f.type)?'ltr':undefined} value={data[f.name]||''} onChange={e=>change(f.name,e.target.value)}/>}</>
  return <div className={'intake-field '+(errors[f.name]?'has-error':'')} key={f.name}>{input}{errors[f.name]&&<p id={id+'-error'} className="intake-error">{tr('Please enter a valid answer. A safe email or phone is needed.','پاسخ معتبر وارد کنید. یک ایمیل یا شماره تماس امن لازم است.')}</p>}</div>
 }
 if(reference)return <section className="intake-page"><div className="intake-confirm"><CheckCircle size={44}/><h1>{tr('Your request was received.','درخواست شما با موفقیت ثبت شد.')}</h1><p>{tr('Thank you for trusting IILA. Authorised staff will review your request and may contact you if you agreed. This does not establish representation or guarantee legal action.','از اعتماد شما به انجمن سپاسگزاریم. افراد مجاز درخواست شما را بررسی می‌کنند و در صورت رضایت با شما تماس می‌گیرند. ثبت درخواست به معنای پذیرش وکالت یا تضمین اقدام قضایی نیست.')}</p><p>{tr('Reference number','کد پیگیری')}</p><strong dir="ltr">{reference}</strong><button onClick={()=>navigator.clipboard.writeText(reference).then(()=>setNotice(tr('Reference copied.','کد کپی شد.')))}>{tr('Copy reference','کپی کد پیگیری')}</button><p role="status">{notice}</p></div></section>
 return <section className="intake-page" dir={dir}>
  <div className="intake-heading"><span className="intake-eyebrow"><ShieldCheck size={16}/>{tr('IILA · Confidential preliminary review','انجمن · بررسی اولیه محرمانه')}</span><h1>{tr('Human rights documentation & legal review','ثبت درخواست مستندسازی و پیگیری نقض حقوق بشر')}</h1><p>{tr('People affected by alleged human rights violations, their families and authorised representatives can request preliminary review by IILA’s legal team. Share only information that is safe and necessary.','آسیب‌دیدگان نقض حقوق بشر، خانواده‌ها و نمایندگان آنها می‌توانند درخواست بررسی اولیه توسط تیم حقوقی انجمن را ثبت کنند. فقط اطلاعات ضروری و ایمن را وارد کنید.')}</p></div>
  <div className="intake-layout"><aside className="intake-sidebar"><div className="intake-security"><LockKeyhole size={22}/><h2>{tr('Your safety comes first','امنیت شما در اولویت است')}</h2><p>{tr('This is an initial review request, not a court filing or an agreement to represent you. No legal outcome is guaranteed.','این فرم درخواست بررسی اولیه است و به معنای ثبت رسمی شکایت یا پذیرش وکالت نیست. نتیجه حقوقی تضمین نمی‌شود.')}</p><p>{tr('Use a safe device and contact channel. Drafts stay in this tab’s memory and are lost if you close or reload it. No case details are stored in your browser.','از دستگاه و راه تماس امن استفاده کنید. پیش‌نویس فقط در حافظه این برگه است و با بستن یا بارگذاری مجدد از بین می‌رود. اطلاعات پرونده در مرورگر ذخیره نمی‌شود.')}</p></div><ol>{sections.map((s,i)=><li key={s.en} className={i===step?'current':i<step?'complete':''} aria-current={i===step?'step':undefined}><span>{i<step?'✓':i+1}</span>{fa?s.fa:s.en}</li>)}</ol></aside>
  <div className="intake-card">
   {!config?.active&&<div className="intake-banner" role="status">{tr('Preview only — confidential submissions are not open yet. Do not enter real personal information or evidence. Secure storage, staff access and notification delivery must be verified before activation.','نسخه پیش‌نمایش — دریافت محرمانه هنوز فعال نیست. اطلاعات واقعی یا مدارک شخصی وارد نکنید. پیش از فعال‌سازی، ذخیره‌سازی امن، دسترسی کارکنان و تحویل اعلان باید تأیید شود.')}</div>}
   <p className="intake-step">{tr('Step','مرحله')} {step+1} / {sections.length}</p><div className="intake-progress" role="progressbar" aria-label={tr('Form progress','پیشرفت فرم')} aria-valuenow={step+1} aria-valuemin={1} aria-valuemax={sections.length}><span style={{width:((step+1)/sections.length*100)+'%'}}/></div>
   <h2 ref={heading} tabIndex={-1}>{fa?sections[step].fa:sections[step].en}</h2>
   <form onSubmit={e=>{e.preventDefault();step<7?next():submit()}} autoComplete="off">
    <datalist id="intake-countries">{countries.map(c=><option key={c} value={c}/>)}</datalist>
    {step===2&&<p className="intake-help">{tr('Do not upload identity documents at this initial stage.','در این مرحله مدارک هویتی بارگذاری نکنید.')}</p>}
    {step===3&&<p className="intake-help">{tr('Reporting to an NGO is not necessarily a judicial complaint.','مراجعه به سازمان غیردولتی لزوماً ثبت شکایت قضایی نیست.')}</p>}
    {sections[step].fields.map(field)}
    {step===5&&<div className="intake-upload" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(!busy)pick(e.dataTransfer.files)}}><Upload size={26}/><label htmlFor="intake-files">{tr('Select or drop evidence images','انتخاب یا کشیدن تصاویر مدارک')}</label><input id="intake-files" type="file" multiple accept="image/jpeg,image/png" onChange={e=>{pick(e.target.files);e.target.value=''}}/><p>{tr('Up to 5 JPG/PNG images, 3 MB each. Images are validated and scanned before private encrypted storage. Videos, PDFs and larger files require a separate secure arrangement; do not email them. Keep your originals.','حداکثر ۵ تصویر JPG یا PNG، هرکدام ۳ مگابایت. تصاویر پیش از ذخیره خصوصی رمزگذاری‌شده بررسی و اسکن می‌شوند. برای ویدئو، PDF یا فایل بزرگ‌تر باید راه امن جداگانه هماهنگ شود؛ آنها را ایمیل نکنید. اصل مدارک را نگه دارید.')}</p><ul>{files.map((f,i)=><li key={i}><span>{f.name} · {(f.size/1024/1024).toFixed(2)} MB</span><button type="button" onClick={()=>{uploads.current.delete(f);setFiles(fs=>fs.filter((_,n)=>n!==i))}}>{tr('Remove','حذف')}</button></li>)}</ul></div>}
    {step===6&&<div className="intake-privacy"><h3>{tr('How your information is used','کاربرد اطلاعات شما')}</h3><p>{tr('Controller: Iranian International Lawyers Association (IILA), Switzerland. The purpose is confidential preliminary assessment and related follow-up. Only designated staff may access cases. Notification emails contain a reference number only. External disclosure requires an appropriate legal basis.','مسئول پردازش: انجمن حقوقدانان بین‌الملل ایرانی (IILA)، سوئیس. هدف، ارزیابی اولیه محرمانه و پیگیری مرتبط است. فقط کارکنان تعیین‌شده دسترسی دارند. ایمیل اعلان فقط کد پیگیری دارد. افشای بیرونی نیازمند مبنای حقوقی مناسب است.')}</p><p>{tr('Retention, backup deletion and rights procedures must be approved before collection opens. To request access, correction, withdrawal or deletion, contact info@iila-swiss.org with your reference number only. Do not email evidence.','مدت نگهداری، حذف نسخه پشتیبان و روش اعمال حقوق باید پیش از شروع دریافت تأیید شود. برای دسترسی، اصلاح، پس‌گرفتن رضایت یا حذف، فقط کد پیگیری را به info@iila-swiss.org اعلام کنید؛ مدارک را ایمیل نکنید.')}</p><Link to={fa?'/fa/intake-privacy':'/intake-privacy'} target="_blank" rel="noreferrer">{tr('Read intake privacy notice','مطالعه اطلاعیه حریم خصوصی فرم')}</Link></div>}
    {step===7&&<><p>{tr('Review your answers before submission. Use Back to make corrections.','پاسخ‌ها را پیش از ثبت بازبینی کنید. برای اصلاح از دکمه قبل استفاده کنید.')}</p><dl className="intake-review">{sections.flatMap(s=>s.fields).filter(f=>visible(f,data)&&data[f.name]!==undefined&&data[f.name]!=='').map(f=><div key={f.name}><dt>{fa?f.fa:f.en}</dt><dd>{f.type==='consent'?tr('Confirmed','تأیید شده'):Array.isArray(data[f.name])?data[f.name].map(v=>{const o=f.options?.find(x=>x[0]===v);return o?o[fa?2:1]:v}).join('، '):f.options?(f.options.find(o=>o[0]===data[f.name])?.[fa?2:1]||data[f.name]):data[f.name]}</dd></div>)}</dl><p>{tr('Images selected: ','تصاویر انتخاب‌شده: ')}{files.length}</p><label className="intake-trap" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label></>}
    {notice&&<p className="intake-error" role="alert">{notice}</p>}{progress&&<p role="status" aria-live="polite">{progress}</p>}
    <div className="intake-actions">{step>0&&<button type="button" disabled={busy} onClick={()=>{setStep(s=>s-1);setNotice('')}}>{tr('Back','قبل')}</button>}<button type="submit" className="intake-primary" disabled={busy||(step===7&&!config?.active)}>{busy?tr('Submitting…','در حال ثبت…'):step===7?tr('Submit confidential request','ثبت محرمانه درخواست'):tr('Continue','ادامه')}<ChevronRight size={17}/></button></div>
   </form>
  </div></div>
 </section>
}
