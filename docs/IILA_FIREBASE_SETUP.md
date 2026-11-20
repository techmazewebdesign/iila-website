# IILA Firebase migration — 2026-11-20

Firebase is the owner's latest choice. This supersedes Supabase provisioning in IILA_INTAKE_DEPLOYMENT.md. The SQL prototype is historical, not the Firebase deployment schema.

## Implemented, not activated
- Firestore transaction adapter for ownership, upload quota, rate limits and idempotent case attachment.
- Server-only encrypted Cloud Storage; readiness requires enforced public access prevention and uniform bucket-level access.
- Browser rules deny all database/storage client access. The authorised server uses IAM, not public download tokens.
- Firebase staff login uses in-memory persistence and pre-enrolled TOTP. Server verifies token revocation, exact UID allowlist, verified email, enrolled second factor and recent authentication.
- Original-byte encryption, image validation, mTLS malware scanning, reference-only email and no automatic submitted-case expiry are retained.
- Draft cleanup locks abandoned uploads before deleting, preventing attachment races. Submitted evidence is never purged by maintenance.

## Required live setup
1. Owner authorised Techmaze Web Design (techmazewebdesign@gmail.com) to own/manage the dedicated IILA Firebase project. IILA remains separate from DeutschPilot. Operational notification mailbox stays info@iila-swiss.org.
2. Owner completes account security. Select/create IILA project and choose database/storage location. Do not link billing or enable paid services without owner authorisation.
3. Provision Firestore and private Cloud Storage, enforce public access prevention/uniform access, inspect IAM and deploy firestore.rules/storage.rules from this repository only.
4. Configure Firebase Auth with Identity Platform for TOTP and verified staff emails. Staff enrol their own passwords/authenticators. Require the exact server UID allowlist; never treat any signed-in user as staff.
5. Set INTAKE_FIREBASE_PROJECT_ID, INTAKE_FIREBASE_STORAGE_BUCKET, INTAKE_FIREBASE_API_KEY and INTAKE_FIREBASE_AUTH_DOMAIN. Prefer workload identity/ADC; optional server-only INTAKE_FIREBASE_SERVICE_ACCOUNT contains service-account JSON. Never expose credentials in browser config or logs.
6. Configure encryption/session keys, real mTLS malware scanner and IILA SMTP securely. Finish backup/restore and key recovery procedures.
7. Verify real clean/EICAR uploads, encrypted persistence, rule/IAM refusal, MFA staff access, reference-only inbox delivery, retry and draft cleanup. Submitted cases stay until explicit owner-approved deletion, with no expiry.
8. Only after those checks set verification/collection flags and deploy live with owner approval.

## Validation limits
Firestore adapter tests use a transaction test double. They do not certify hosted transactions, deployed rules or IAM. Java was not available for emulator execution. Real project provisioning, upload/mail delivery and full browser submission remain pending.

Local validation: 16 tests passed; production build passed; npm audit --omit=dev reports zero known vulnerabilities. Browser-only app/auth packages are pinned; unused browser Firestore package was removed. Live Firebase verification remains pending.

## Provisioned 2026-11-20 under owner-authorised Techmaze account
- Project iila-swiss-intake (project number 43735076379), display name IILA Confidential Intake. Current plan Spark; no billing account linked.
- Web app IILA Intake Staff: 1:43735076379:web:758083ccdefcd207c332be.
- Firestore (default), Standard/Native, europe-west6 (Zurich, Switzerland), free tier, deletion protection enabled.
- Firestore rules compiled and released; index deployed. Live unauthenticated collection-list attempt returned HTTP 403 PERMISSION_DENIED with no documents.
- No applicant submissions stored; server credentials, Auth/TOTP, scanner, SMTP and website runtime connection remain unconfigured.
- Firebase Storage page explicitly requires upgrade. Billing dialog offers existing Firebase Payment and My Billing Account accounts. No account selected and no upgrade performed. Owner must authorise usage-based Blaze billing and choose the billing account before uploads can be provisioned.
