import {firebaseApp} from './firebase-store.mjs'
import {fail} from './security.mjs'
import {CAPTCHA_ACTION} from '../../src/intake/captcha.js'
export {CAPTCHA_ACTION}
export function requireCaptchaToken(token){if(typeof token!=='string'||token.length<20||token.length>8192)fail(400,'human_check_required')}
export async function verifyCaptcha(token,hostname,{request=fetch,getAccessToken=()=>firebaseApp().options.credential.getAccessToken(),now=Date.now()}={}){
 requireCaptchaToken(token)
 const siteKey=process.env.INTAKE_RECAPTCHA_SITE_KEY,project=process.env.INTAKE_FIREBASE_PROJECT_ID
 if(!siteKey||!project||!hostname)fail(503,'human_check_unavailable')
 let result
 try{
  const credential=await getAccessToken()
  const response=await request('https://recaptchaenterprise.googleapis.com/v1/projects/'+encodeURIComponent(project)+'/assessments',{method:'POST',headers:{Authorization:'Bearer '+credential.access_token,'Content-Type':'application/json'},body:JSON.stringify({event:{token,siteKey,expectedAction:CAPTCHA_ACTION}}),signal:AbortSignal.timeout(8000)})
  if(!response.ok)fail(503,'human_check_unavailable')
  result=await response.json()
 }catch{fail(503,'human_check_unavailable')}
 const p=result?.tokenProperties,age=now-Date.parse(p?.createTime)
 if(p?.valid!==true||p.hostname!==hostname||p.action!==CAPTCHA_ACTION||!Number.isFinite(age)||age< -5000||age>120000)fail(400,'human_check_required')
 return true
}
