import test from 'node:test'
import assert from 'node:assert/strict'
import {staffErrorMessage,staffRequestError} from '../src/intake/staff-errors.js'
test('staff sign-in errors give safe actionable messages without revealing account existence',()=>{
 const invalid=staffErrorMessage({code:'auth/invalid-credential'})
 assert.equal(staffErrorMessage({code:'auth/user-not-found'}),invalid)
 assert.equal(staffErrorMessage({code:'auth/wrong-password'}),invalid)
 assert.match(invalid,/separate IILA portal password/)
 assert.match(staffErrorMessage({code:'auth/invalid-verification-code'}),/six-digit/)
 assert.match(staffErrorMessage({code:'auth/network-request-failed'}),/internet/)
 assert.match(staffErrorMessage({code:'auth/too-many-requests'}),/Wait/)
 assert.match(staffErrorMessage({code:'auth/invalid-credential'},true),/[\u0600-\u06ff]/)
 assert.ok(!staffErrorMessage({code:'unknown',message:'SECRET-TOKEN'}).includes('SECRET-TOKEN'))
})
test('staff API errors distinguish session, permissions, MFA, limits and service availability',()=>{
 for(const [status,code,expected]of [[401,'anything','staff/session-expired'],[403,'forbidden','staff/not-authorized'],[403,'mfa_required','staff/mfa-required'],[429,'rate_limited','staff/rate-limited'],[503,'SECRET','staff/service-unavailable']]){
  const problem=staffRequestError(status,code);assert.equal(problem.code,expected);assert.ok(!staffErrorMessage(problem).includes('SECRET'))
 }
})
