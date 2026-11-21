import {useEffect,useRef,useState} from 'react'
import {CAPTCHA_ACTION} from '../intake/captcha'
let loading
function loadCaptcha(language){
 if(window.grecaptcha?.enterprise?.render)return Promise.resolve(window.grecaptcha.enterprise)
 if(!loading)loading=new Promise((resolve,reject)=>{
  const script=document.createElement('script');let settled=false
  const finish=error=>{if(settled)return;settled=true;clearTimeout(timer);if(error){script.remove();loading=null;reject(new Error('Verification unavailable'))}else resolve(window.grecaptcha.enterprise)}
  window.__iilaCaptchaReady=()=>finish(false)
  const timer=setTimeout(()=>finish(true),15000)
  script.src='https://www.recaptcha.net/recaptcha/enterprise.js?onload=__iilaCaptchaReady&render=explicit&hl='+encodeURIComponent(language)
  script.async=true;script.defer=true;script.onerror=()=>finish(true);document.head.appendChild(script)
 })
 return loading
}
export default function IntakeCaptcha({siteKey,language,onToken}){
 const container=useRef(null),callback=useRef(onToken);callback.current=onToken
 const [error,setError]=useState(false),[retry,setRetry]=useState(0)
 const fa=language==='fa'
 useEffect(()=>{
  const element=container.current
  let active=true,widget,api;setError(false);callback.current('')
  loadCaptcha(language).then(client=>{
   if(!active)return;api=client
   widget=client.render(element,{sitekey:siteKey,action:CAPTCHA_ACTION,size:'compact',callback:token=>{if(active)callback.current(token)},'expired-callback':()=>{if(active)callback.current('')},'error-callback':()=>{if(active){callback.current('');setError(true)}}})
  }).catch(()=>{if(active)setError(true)})
  return()=>{active=false;callback.current('');if(api&&widget!==undefined)try{api.reset(widget)}catch{};if(element)element.replaceChildren()}
 },[siteKey,language,retry])
 return <div className="intake-human-check"><p>{fa?'لطفاً پیش از ارسال، تأیید انسانی را کامل کنید.':'Please complete the human verification before sending.'}</p><div key={retry} ref={container}/>{error&&<><p role="alert">{fa?'تأیید انسانی بارگذاری نشد. دوباره تلاش کنید.':'Human verification could not load. Please try again.'}</p><button type="button" onClick={()=>setRetry(n=>n+1)}>{fa?'تلاش مجدد':'Try verification again'}</button></>}</div>
}
