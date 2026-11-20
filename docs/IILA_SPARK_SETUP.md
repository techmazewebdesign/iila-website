# IILA no-billing Spark setup — 2026-11-20

This supersedes the Cloud Storage/Blaze parts of IILA_FIREBASE_SETUP.md. Owner requested no paid plan. Use Techmaze Web Design account for project iila-swiss-intake; operational/admin mailbox remains info@iila-swiss.org.

## Provisioned and verified
- Project remains Spark with billingEnabled=false and no billing account linked (Cloud Billing API verified).
- Firestore Standard/Native default database in Zurich (europe-west6), deletion protection enabled.
- Deny-all client rules remain released. Ciphertext and case-payload index exemptions deployed. No public Firebase Storage bucket exists or is needed by the current runtime.
- Email/password authentication enabled. Identity Platform upgraded while remaining on Spark. TOTP provider enabled with adjacentIntervals=1. Public signup disabled and improved email privacy enabled; no staff users created yet.
- Real hosted test saved/retrieved 3,145,792 bytes of random fictional ciphertext through the actual FirestoreEvidence adapter, compared byte-for-byte, verified unauthenticated chunk read HTTP 403 and deleted all test chunks/manifest. Usage counter returns to zero. This did not test malware scanning or actual applicant submission.
- 20 local tests pass and production build passes. Previously completed dependency audit reports zero known production vulnerabilities; no new dependencies were added for Spark evidence storage.

## How free evidence storage works
- Application encryption occurs before storage, preserving original evidence bytes.
- Split ciphertext into binary records of at most 512 KiB, below Firestore's 1 MiB document limit. Up to 3 MiB original images plus encryption overhead are supported; existing five-image limit remains.
- Ciphertext records are excluded from indexing. The server uses transactions for write-once manifests/chunks, byte accounting, integrity-checked reads and removal of abandoned drafts.
- Evidence budget is 512 MiB, leaving headroom within Firestore's 1 GiB free total for cases, metadata, indexes and audit records. This is not a guarantee against every project quota; normal Firestore daily/read/write/egress limits also apply.
- Capacity exhaustion refuses new storage; it never deletes submitted evidence. Submitted cases have no automatic expiry, but finite free capacity cannot promise unlimited volume or hosted backups.
- No Blaze upgrade, billing attachment, SMS MFA or paid backup service was enabled.

## Remaining before public activation
1. Owner must set the info@iila-swiss.org staff password and verify the email, then enrol a personal TOTP authenticator. Add exact resulting UID to the server allowlist. Do not share passwords/authenticator secrets in chat.
2. Configure least-privilege server credentials or workload identity, encryption/session keys with owner-controlled recovery, and public Firebase Auth web config on Vercel. Never deploy developer CLI credentials as the application identity.
3. Connect existing IILA SMTP securely and verify inbox delivery of a labelled fictional reference-only notification.
4. Provision a real malware-scanning endpoint with mTLS. ClamAV software is free, but no always-on scanner host has been provisioned. Do not bypass scanning or claim an all-free fully operational production service before hosting and uptime are resolved.
5. Arrange secure backup/key recovery suitable for this evidence; paid managed Firestore backup features are not included on Spark. Finalise operational/privacy details.
6. Perform full browser submission/upload, unauthorised/staff/MFA tests and scanner checks before enabling collection. Public intake is still closed.

## Staff setup follow-up
- Staff account info@iila-swiss.org exists; email verification and TOTP enrolment are owner actions, not automatically marked complete.
- Added server-validated allowlisted setup-status endpoint. Password-only login permits only email verification/authenticator setup; all case APIs still require validated enrolled TOTP. Tokens, pending secret and case state remain memory-only with ten-minute idle sign-out.
- Dedicated server identity iila-intake-server has only datastore.user and firebaseauth.viewer roles in the IILA project. The developer CLI identity is not deployed. Runtime credential, encryption/session keys and staff UID are encrypted preview environment settings; collection/security/mail flags stay false. Operator recovery copies are protected outside the repository. No production environment settings or live collection changed.
- Node 24 is pinned. Firebase Admin 14.5.1 uses a compatibility pin of jwks-rsa 3.2.2 because the hosting runtime rejects the ESM-only transitive dependency in jwks-rsa 4. Regression covers server import with require-of-ESM disabled. All 23 tests/build pass; production audit zero known vulnerabilities.
