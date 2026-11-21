import test from 'node:test'
import assert from 'node:assert/strict'
import {verifyCaptcha,CAPTCHA_ACTION} from '../server/intake/captcha.mjs'
const token='fictional-token-for-testing-only'
process.env.INTAKE_RECAPTCHA_SITE_KEY='fictional-site-key';process.env.INTAKE_FIREBASE_PROJECT_ID='iila-fictional'
const provider=properties=>({getAccessToken:async()=>({access_token:'fictional-access-token'}),request:async(url,options)=>{
 const body=JSON.parse(options.body);assert.deepEqual(Object.keys(body),['event']);assert.deepEqual(Object.keys(body.event).sort(),['expectedAction','siteKey','token']);assert.equal(body.event.expectedAction,CAPTCHA_ACTION)
 assert.ok(!JSON.stringify(body).includes('incidentDescription'));return {ok:true,json:async()=>({tokenProperties:properties})}
}})
const valid=()=>({valid:true,hostname:'iila-swiss.org',action:CAPTCHA_ACTION,createTime:new Date().toISOString()})
test('CAPTCHA requires a server-validated fresh token bound to the exact hostname and action',async()=>{
 assert.equal(await verifyCaptcha(token,'iila-swiss.org',provider(valid())),true)
 for(const change of [{valid:false},{hostname:'attacker.invalid'},{action:'different'},{createTime:'invalid'},{createTime:new Date(Date.now()-121000).toISOString()},{createTime:new Date(Date.now()+10000).toISOString()}])await assert.rejects(verifyCaptcha(token,'iila-swiss.org',provider({...valid(),...change})),{code:'human_check_required'})
})
test('CAPTCHA missing tokens, provider errors and quota exhaustion never pass verification',async()=>{
 for(const value of [undefined,'short','x'.repeat(8193)])await assert.rejects(verifyCaptcha(value,'iila-swiss.org',{getAccessToken:()=>{throw new Error('Must not be called')}}),{code:'human_check_required'})
 await assert.rejects(verifyCaptcha(token,'iila-swiss.org',{getAccessToken:async()=>({access_token:'fictional'}),request:async()=>({ok:false,status:429})}),{code:'human_check_unavailable'})
 await assert.rejects(verifyCaptcha(token,'iila-swiss.org',{getAccessToken:async()=>{throw new Error('No credential')}}),{code:'human_check_unavailable'})
})
