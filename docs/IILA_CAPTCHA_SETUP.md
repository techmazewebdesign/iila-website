# IILA CAPTCHA and image limits — 2026-11-21

Google reCAPTCHA checkbox key is configured in dedicated IILA project, restricted to IILA domains. The dedicated application service account has reCAPTCHA Enterprise Agent in addition to its existing data/auth-reader roles; developer OAuth credentials are not deployed. Cloud Billing readback remains billingEnabled=false. The no-billing assessment allowance is finite (currently10,000 monthly across the applicable account/organization scope); quota exhaustion refuses verification, never bypasses it.

Runtime setting INTAKE_RECAPTCHA_SITE_KEY contains the public widget key, stored with server settings and returned as public config. Assessments authenticate server-side with the existing limited application identity. They send only token/siteKey/expectedAction, not case fields, evidence, filenames, email addresses or extra IP/user-agent fields. The browser provider itself processes technical browser/network data; the bilingual privacy notice discloses it. Recaptcha.net is used for the client widget. Do not use a test key in production.

The checkbox appears at final review, not before every field/image. A verified token is required to issue the signed HTTP-only upload/submission session. Assessment must return valid=true, exact expected hostname, action intake_session and a fresh timestamp. Provider errors, invalid/reused/expired tokens and429 quota errors refuse verification. IP-based limits run before provider assessment. One verified session may submit one case; retries with the same case ID remain idempotent. The owner record is atomically marked submitted with the case, and further uploads/new case IDs for that session are refused.

JPG/PNG evidence must be strictly smaller than3,000,000 bytes each. Exactly3MB is rejected. Both client selection/drop and server base64-decoded length enforce this; extension/header validation, full image decode,20MP pixel budget, five-image cap, malware scanner requirement and private original-byte encryption remain. The evidence adapter's larger legacy ciphertext bound is retained to read existing objects safely; it does not loosen new-upload validation.

Public-form CSP alone permits the CAPTCHA script/frame domains. Staff and privacy CSP remain restricted to their previous self-only scripts. No analytics added to intake pages. Preview hostnames must be explicitly added to the CAPTCHA key before browser verification testing; never allow all vercel.app domains.

Actual negative assessment using the application service identity returned HTTP200 with invalidToken rejected; validator returned human_check_required. Automated tests cover hostname/action/age validity, failure/quotas, one-case sessions, strict image byte boundaries, and CSP separation. A real solved-human positive end-to-end check is still pending; agents must not claim it occurred. No scanner has been provisioned. CAPTCHA is bot protection, not antivirus; public collection/security flags remain false and the public form remains unpublished pending real scanning/recovery/end-to-end checks.

Sources:
- https://docs.cloud.google.com/recaptcha/docs/billing-information
- https://docs.cloud.google.com/recaptcha/docs/create-assessment-website
- https://docs.cloud.google.com/recaptcha/docs/instrument-web-pages-with-checkbox
