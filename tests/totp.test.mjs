import test from 'node:test'
import assert from 'node:assert/strict'
import {normalizeTotpCode,enrollmentExpired} from '../src/intake/totp.js'
import {staffErrorMessage} from '../src/intake/staff-errors.js'
test('authenticator input accepts Persian and Arabic digits and harmless paste spacing',()=>{
 assert.equal(normalizeTotpCode('۱۲۳ ۴۵۶'),'123456')
 assert.equal(normalizeTotpCode('١٢٣٤٥٦'),'123456')
 assert.equal(normalizeTotpCode('\u2066123456\u2069'),'123456')
 assert.equal(normalizeTotpCode('1234567'),'1234567')
 assert.equal(normalizeTotpCode('123abc'),'123abc')
})
test('expired or invalid authenticator setup is refused and explains how to restart',()=>{
 const now=Date.now()
 assert.equal(enrollmentExpired(new Date(now+60000).toISOString(),now),false)
 assert.equal(enrollmentExpired(new Date(now).toISOString(),now),true)
 assert.equal(enrollmentExpired('invalid',now),true)
 assert.match(staffErrorMessage({code:'staff/totp-setup-expired'}),/new QR code/)
})
