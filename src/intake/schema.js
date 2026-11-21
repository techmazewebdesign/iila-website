export const SCHEMA_VERSION = '2026-11-20-v1'
export const MAX_FILES = 5
export const MAX_FILE_BYTES = 3 * 1024 * 1024
export const choice = (name,en,fa,options,required=true,when=null) => ({name,en,fa,type:'select',options,required,when})
export const field = (name,en,fa,type='text',required=false,when=null) => ({name,en,fa,type,required,when})
const yn = [['yes','Yes','بله'],['no','No','خیر']]
export const sections = [
{en:'Applicant',fa:'نوع درخواست و متقاضی',fields:[
 {...choice('categories','Applicant categories','وضعیت متقاضی',[['eye','Eye injury','آسیب‌دیده چشمی'],['physical','Physical injury','آسیب‌دیده جسمی'],['bereaved','Bereaved family','خانواده جان‌باخته'],['prisoner','Political prisoner','زندانی سیاسی'],['former','Former political prisoner','زندانی سیاسی سابق'],['other','Other','سایر']]),type:'checks'},
 field('categoryOther','Please describe the other category','توضیح سایر موارد','text',true,['categories','other']),
 field('firstName','First name (or safe alias)','نام (یا نام مستعار امن)','text',true),
 field('lastName','Last name (or safe alias)','نام خانوادگی (یا نام مستعار امن)','text',true),
 field('email','Safe email address','ایمیل امن','email'),
 field('phone','Safe phone number, including country code','شماره تماس امن با کد کشور','tel'),
 choice('contactMethod','Preferred contact method','روش ترجیحی تماس',[['email','Email','ایمیل'],['phone','Telephone','تلفن'],['secure','Secure messaging, by arrangement','پیام‌رسان امن پس از هماهنگی']]),
 choice('onBehalf','Who are you submitting for?','از طرف چه کسی درخواست می‌دهید؟',[['self','Myself','خودم'],['family','Family member','عضو خانواده'],['representative','Lawyer / representative','وکیل یا نماینده'],['other','Other','سایر']]),
 field('authorityDetails','Relationship and authority to act','توضیح نسبت و اختیار نمایندگی','textarea',true,['onBehalf','!self'])
]},
{en:'Nationality & residence',fa:'تابعیت و اقامت',fields:[
 field('currentCountry','Country where you are now','کشور محل حضور فعلی','country',true),
 choice('dualNationality','Do you have another nationality?','آیا تابعیت دیگری دارید؟',yn),
 field('otherNationalities','Other nationality countries (one or more)','کشور یا کشورهای تابعیت دیگر','text',true,['dualNationality','yes']),
 choice('residencePermit','Do you hold lawful residence in another country?','آیا در کشور دیگری اقامت قانونی دارید؟',yn),
 field('residenceCountry','Country of residence','کشور محل اقامت','country',true,['residencePermit','yes']),
 field('residenceType','Residence type and optional explanation','نوع اقامت و توضیح اختیاری','textarea',true,['residencePermit','yes'])
]},
{en:'Affected person',fa:'شخص آسیب‌دیده یا جان‌باخته',fields:[
 field('victimName','Affected person’s name (if different)','نام شخص موضوع پرونده (اگر متفاوت است)','text',true,['onBehalf','!self']),
 field('relationship','Your relationship to this person','نسبت شما با شخص','text',true,['onBehalf','!self']),
 choice('victimStatus','Current status','وضعیت فعلی شخص',[['alive','Alive','در قید حیات'],['deceased','Deceased','جان‌باخته'],['missing','Missing','مفقود'],['detained','Detained / imprisoned','بازداشت یا زندان'],['unknown','Unknown','نامشخص']]),
 choice('authority','Do you have authority or consent to provide this information?','آیا اختیار یا رضایت ارائه اطلاعات را دارید؟',[...yn,['pending','Seeking consent / authority','در حال پیگیری رضایت یا اختیار']],true,['onBehalf','!self']),
 field('victimNotes','Additional information (optional; no identity documents)','توضیح تکمیلی (اختیاری؛ بدون مدارک هویتی)','textarea')
]},
{en:'Previous reports',fa:'سوابق مراجعه و شکایت',fields:[
 choice('previousReport','Have you reported this before?','آیا قبلاً این موضوع را مطرح کرده‌اید؟',yn),
 {...choice('previousBodies','Previous institutions','مراجع قبلی',[['icc','International Criminal Court (ICC)','دیوان کیفری بین‌المللی'],['un','UN human rights mechanisms','سازمان ملل و سازوکارهای حقوق بشری'],['amnesty','Amnesty International','عفو بین‌الملل'],['domestic','Domestic court / authority','دادگاه یا مقام قضایی داخلی'],['ngo','Another human rights organisation','سازمان حقوق بشری دیگر'],['other','Other','سایر']],true,['previousReport','yes']),type:'checks'},
 field('previousReference','Institution, country, case / reference number','نام مرجع، کشور، شماره پرونده یا کد پیگیری','textarea',true,['previousReport','yes']),
 choice('previousStatus','Previous case status','مرحله اقدام قبلی',[['submitted','Initial submission','ثبت اولیه'],['review','Under review','در حال بررسی'],['evidence','Awaiting evidence','در انتظار مدارک'],['decision','Response / decision received','پاسخ یا تصمیم دریافت شده'],['closed','Closed','مختومه'],['unknown','Unknown','نامشخص']],true,['previousReport','yes']),
 field('previousDate','Previous submission date (if known)','تاریخ ثبت یا مکاتبه قبلی (در صورت اطلاع)','text',false,['previousReport','yes']),
 field('previousOutcome','Describe previous responses and outcomes','شرح پاسخ‌ها و نتایج قبلی','textarea',true,['previousReport','yes']),
 choice('otherLawyer','Is another lawyer or organisation working on this?','آیا وکیل یا نهاد دیگری پیگیر موضوع است؟',yn),
 field('otherLawyerDetails','Please explain','توضیح دهید','textarea',true,['otherLawyer','yes'])
]},
{en:'Incident',fa:'شرح واقعه',fields:[
 choice('dateCalendar','Date format','نوع تاریخ',[['gregorian','Gregorian exact date','تاریخ دقیق میلادی'],['persian','Persian date','تاریخ شمسی'],['approximate','Approximate date / range','تاریخ یا بازه تقریبی']]),
 field('incidentDate','Exact Gregorian date','تاریخ دقیق میلادی','date',true,['dateCalendar','gregorian']),
 field('incidentDateText','Persian date or approximate date / range (specify year)','تاریخ شمسی یا بازه تقریبی (با ذکر سال)','text',true,['dateCalendar','!gregorian']),
 field('incidentCountry','Country of incident','کشور وقوع','country',true),
 field('incidentCity','City of incident','شهر وقوع','text',true),
 field('incidentLocation','More precise location (only if safe)','محل دقیق‌تر (فقط در صورت ایمن بودن)'),
 {...choice('violations','Alleged violations','موارد نقض ادعایی',[['eye','Eye injury','آسیب چشمی'],['shooting','Shooting / physical injury','تیراندازی یا جراحت'],['torture','Torture / ill-treatment','شکنجه یا بدرفتاری'],['detention','Arbitrary detention','بازداشت خودسرانه'],['death','Killing / death','قتل یا مرگ'],['disappearance','Enforced disappearance','ناپدیدسازی قهری'],['trial','Unfair trial','محاکمه ناعادلانه'],['other','Other','سایر']]),type:'checks'},
 field('incidentDescription','What happened? Distinguish what you saw from what you heard or inferred.','شرح کامل واقعه؛ مشاهدات، شنیده‌ها و برداشت‌ها را جدا کنید.','textarea',true),
 field('responsible','Possible responsible persons / bodies (only what you know)','اشخاص یا نهادهای احتمالی مسئول (فقط آنچه می‌دانید)','textarea'),
 field('consequences','Consequences: injuries, treatment, detention, loss or later threats','پیامدها: جراحت، درمان، بازداشت، زیان یا تهدیدهای بعدی','textarea')
]},
{en:'Evidence & safety',fa:'مدارک، شهود و امنیت',fields:[
 {...choice('evidenceCategories','Evidence available','مدارک موجود',[['photo','Photos / video','تصویر یا فیلم'],['medical','Medical records','گزارش پزشکی'],['official','Death certificate / official record','گواهی فوت یا سند رسمی'],['arrest','Arrest / court documents','سند بازداشت یا قضایی'],['witness','Witness statements','اظهارات شاهد'],['letters','Correspondence','مکاتبات'],['media','Media report / web link','گزارش رسانه‌ای یا پیوند'],['other','Other','سایر']],false),type:'checks'},
 field('evidenceDescription','Describe evidence and how it relates to the incident','شرح مدارک و ارتباط آنها با واقعه','textarea'),
 choice('witnesses','Are there direct witnesses?','آیا شاهد مستقیم وجود دارد؟',[...yn,['unknown','I do not know','اطلاع ندارم']]),
 field('witnessDetails','Number of witnesses and whether safe contact may be possible; no identifying details','تعداد شهود و امکان تماس امن؛ بدون اطلاعات شناسایی','textarea',true,['witnesses','yes']),
 choice('securityRisk','Could disclosure put anyone at risk?','آیا افشای هویت، محل یا مدارک موجب خطر می‌شود؟',[...yn,['unsure','Unsure','اطمینان ندارم']])
]},
{en:'Privacy & consent',fa:'محرمانگی و رضایت',fields:[
 choice('contactConsent','May IILA contact you for follow-up?','آیا انجمن برای تکمیل اطلاعات با شما تماس بگیرد؟',yn),
 choice('identityPreference','Preferred identity handling','شیوه ترجیحی ذکر هویت',[['real','Real name at the initial stage','نام واقعی در مرحله اولیه'],['alias','Alias until further arrangement','نام مستعار تا هماهنگی بیشتر'],['later','Decide after consultation','پس از مشاوره تصمیم می‌گیرم']]),
 {...field('truthConsent','I confirm the information is accurate to the best of my knowledge.','تأیید می‌کنم اطلاعات تا حد آگاهی من صحیح و دقیق است.','consent',true)},
 {...field('processingConsent','I consent to confidential receipt, storage and preliminary review of my information and evidence.','با دریافت، نگهداری و بررسی محرمانه اطلاعات و مدارک برای ارزیابی اولیه موافقم.','consent',true)},
 {...field('legalConsent','I understand this does not establish representation or file a complaint with any court or international body.','می‌دانم ارسال فرم به معنای پذیرش وکالت یا ثبت شکایت نزد دادگاه یا نهاد بین‌المللی نیست.','consent',true)}
]},
{en:'Review & submit',fa:'بازبینی و ثبت نهایی',fields:[]}
]
export function visible(f,data) {
 if(!f.when) return true
 const [key,value]=f.when
 if(value.startsWith('!')) return Boolean(data[key]) && data[key]!==value.slice(1)
 return Array.isArray(data[key]) ? data[key].includes(value) : data[key]===value
}
export function validate(data,onlySection=null) {
 const errors={}
 if(!data || typeof data!=='object' || Array.isArray(data)) return {form:'invalid'}
 const fields=(onlySection===null?sections:sections.slice(onlySection,onlySection+1)).flatMap(s=>s.fields)
 for(const f of fields) {
  if(!visible(f,data)) continue
  const v=data[f.name]
  if(f.required && (v===undefined || v==='' || v===false || (Array.isArray(v)&&!v.length))) {errors[f.name]='required';continue}
  if(v===undefined || v==='') continue
  if(f.type==='consent') {if(v!==true) errors[f.name]='invalid';continue}
  if(f.type==='checks') {if(!Array.isArray(v)||v.length>20||v.some(x=>!f.options.some(o=>o[0]===x)))errors[f.name]='invalid';continue}
  if(typeof v!=='string' || v.length>(f.type==='textarea'?12000:500)) {errors[f.name]='invalid';continue}
  if(f.options && !f.options.some(o=>o[0]===v)) errors[f.name]='invalid'
  if(f.type==='email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) errors[f.name]='invalid'
  if(f.type==='date' && (!/^\d{4}-\d{2}-\d{2}$/.test(v)||Number.isNaN(Date.parse(v))||new Date(v).toISOString().slice(0,10)!==v)) errors[f.name]='invalid'
 }
 if(onlySection===null || onlySection===0) {
  if(!data.email && !data.phone) errors.email='contact'
  if(data.contactMethod==='email'&&!data.email) errors.email='required'
  if(data.contactMethod==='phone'&&!data.phone) errors.phone='required'
 }
 return errors
}
export function cleanData(data) {
 return Object.fromEntries(sections.flatMap(s=>s.fields).filter(f=>visible(f,data)&&data[f.name]!==undefined).map(f=>[f.name,typeof data[f.name]==='string'?data[f.name].trim():data[f.name]]))
}
