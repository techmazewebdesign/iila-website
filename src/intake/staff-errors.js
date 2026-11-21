const messages={
 credentials:['The staff email or IILA portal password is incorrect. Use your separate IILA portal password.','ایمیل کارکنان یا رمز پرتال انجمن نادرست است. از رمز جداگانه پرتال انجمن استفاده کنید.'],
 email:['Enter a valid staff email address.','نشانی ایمیل معتبر کارکنان را وارد کنید.'],
 rate:['Too many attempts. Wait a few minutes before trying again.','تلاش‌ها بیش از حد است. چند دقیقه صبر کنید و دوباره تلاش کنید.'],
 network:['Could not connect to the sign-in service. Check your internet connection and try again.','اتصال به سرویس ورود ممکن نیست. اینترنت را بررسی و دوباره تلاش کنید.'],
 config:['Staff sign-in configuration needs administrator attention.','تنظیمات ورود کارکنان به بررسی مدیر نیاز دارد.'],
 code:['The authenticator code is incorrect. Enter the current six-digit code and check your phone’s automatic time setting.','کد رمزساز نادرست است. کد شش‌رقمی فعلی را وارد کنید و تنظیم خودکار ساعت تلفن را بررسی کنید.'],
 session:['Your sign-in or verification session expired. Sign out and sign in again.','نشست ورود یا تأیید منقضی شده است. خارج شوید و دوباره وارد شوید.'],
 emailVerification:['Verify your staff email before setting up an authenticator.','پیش از تنظیم رمزساز، ایمیل کارکنان را تأیید کنید.'],
 access:['This account is not enabled for IILA staff access. Contact the administrator.','این حساب برای دسترسی کارکنان انجمن فعال نیست. با مدیر تماس بگیرید.'],
 mfa:['Sign in again and complete authenticator verification.','دوباره وارد شوید و تأیید رمزساز را تکمیل کنید.'],
 unavailable:['The staff service is temporarily unavailable. Try again later; do not send case information by email.','سرویس کارکنان موقتاً در دسترس نیست. بعداً دوباره تلاش کنید؛ اطلاعات پرونده را ایمیل نکنید.'],
 fallback:['The action could not be completed. Try again; if it continues, contact the administrator.','عملیات انجام نشد. دوباره تلاش کنید و در صورت تداوم با مدیر تماس بگیرید.']
}
const groups={
 credentials:['auth/invalid-credential','auth/invalid-login-credentials','auth/wrong-password','auth/user-not-found'],
 email:['auth/invalid-email','staff/email-required'],rate:['auth/too-many-requests','staff/rate-limited'],
 network:['auth/network-request-failed'],config:['auth/unauthorized-domain','auth/operation-not-allowed','auth/invalid-api-key','auth/app-not-authorized'],
 code:['auth/invalid-verification-code','auth/missing-verification-code','auth/invalid-totp-code'],
 session:['auth/code-expired','auth/session-expired','auth/requires-recent-login','auth/invalid-multi-factor-session','auth/multi-factor-info-not-found','staff/session-expired'],
 emailVerification:['auth/unverified-email'],access:['auth/user-disabled','staff/not-authorized'],mfa:['staff/mfa-required'],unavailable:['staff/service-unavailable']
}
export function staffErrorMessage(error,persian=false){
 const group=Object.entries(groups).find(([,codes])=>codes.includes(error?.code))?.[0]||'fallback'
 return messages[group][persian?1:0]
}
export function staffRequestError(status,code){
 const key=status===401?'staff/session-expired':status===403?(code==='mfa_required'?'staff/mfa-required':'staff/not-authorized'):status===429?'staff/rate-limited':'staff/service-unavailable'
 return Object.assign(new Error('Staff request failed'),{code:key})
}
