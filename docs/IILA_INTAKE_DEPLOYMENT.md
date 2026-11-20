# IILA confidential intake — implementation and launch record

Date: 2026-11-20. Base: origin/main 876ebf9.
Branch: codex/iila-secure-intake-20261120.
Implementation is a review preview, not an active confidential collection service.

## Review URLs
- English: https://iila-website-3vfxaj41v-techmazewebdesigns-projects.vercel.app/human-rights-complaint
- Persian: https://iila-website-3vfxaj41v-techmazewebdesigns-projects.vercel.app/fa/human-rights-complaint
- Staff: /intake-admin (and /fa/intake-admin).
- Privacy: /intake-privacy (and /fa/intake-privacy).

## Verified
- Eleven Node tests pass, including real PostgreSQL execution using PGlite.
- Tests cover private tables/function permissions, upload ownership/limits, atomic
  idempotent submission, schema validation, consent, expiry/forgery of sessions,
  AES-GCM tamper detection, TLS scanner responses, simulated malware rejection,
  encryption of original image bytes, and reference-only mail composition.
- Scanner integration tests use an in-process TLS test double, not a deployed ClamAV.
- Mail composition test uses a stub transport; no live email was delivered.
- Production build succeeds. npm audit: zero known vulnerabilities after dependency repairs.
- Vercel preview /api/intake?action=config returns active:false.
- Sensitive preview responses have CSP, no-store, no-referrer, anti-framing and noindex.
- Browser: empty validation, conditional category/nationality, complete eight-step
  fictional flow, review, disabled final submission and Persian switching verified.
- 390px mobile Persian layout: no horizontal overflow. File chooser test timed out;
  real browser image-selection/upload remains unverified.
- Hostinger shows info@iila-swiss.org Active; existing SPF, DKIM and DMARC configured.
  DNS is hosted at Cloudflare. DMARC p=none is monitoring, not enforcement.
- No DNS records or mailbox passwords changed.

## Data flow and controls
Public form -> same-origin JSON endpoint -> bounded image decoding + ClamAV over
mutually authenticated TLS -> application AES-256-GCM -> private evidence bucket.
Case answers, file metadata and notes are separately encrypted with context-bound
authentication. Original image bytes are preserved; SHA-256 is stored encrypted.
Do not claim this removes EXIF metadata: originals are deliberately preserved.

A signed Secure/HttpOnly/SameSite=Strict cookie identifies a one-hour intake session.
An independent CSRF token, exact Origin check and JSON-only requests protect writes.
Server-side schema validation uses the same allowed fields/options as the UI.
Hidden/unknown answers are discarded. PostgreSQL rate limits are atomic and keyed
by HMAC of the ingress IP; raw IP is not stored by this code. Hosting providers may
still keep network logs; provider retention requires separate approval.
Uploads are bounded to five JPG/PNG images, 3 MiB each. SVG, PDF, DOCX, video and
large files are intentionally unsupported in this first implementation and must
not be emailed; an additional secure delivery channel is not yet provisioned.

Staff requests validate the token with Supabase Auth, require aal2 and a server-side
user UUID allowlist. No generic authenticated/anonymous database or storage access
is granted. Tokens/case drafts stay in memory, not localStorage. Staff idle timeout
is ten minutes. Evidence downloads require staff auth and an audit insert and are
returned as attachments. No public or signed evidence links are issued.

Notification destination and sender are fixed to info@iila-swiss.org. Emails contain
only a reference and portal URL, no name, contact details, narrative or attachments.
A stored case remains accepted if SMTP fails; pending notification is retried through
the authenticated staff portal or the maintenance operator job.

Sensitive routes use a full-document boundary on entry/exit to avoid analytics
loaded on public pages continuing inside the form. Sensitive CSP blocks third-party
scripts/fonts, including Vercel's injected preview-feedback script. The public
website's analytics remain in place. No case values are sent to analytics or AI.

## Launch configuration — all currently missing
1. Choose organisation ownership for a dedicated IILA Supabase project. The only
   connected organisation is named "Deutsch Pilot"; do not create a project there
   without the owner's organisation choice. Do not put IILA cases in its existing
   Deutsch Project database. Prefer an IILA-controlled project in Zurich if approved.
2. Provision dedicated Supabase database/Auth/Storage; disable public signup; apply
   database/iila-intake.sql after inspecting the new project. Verify no unexpected
   policies grant access to the evidence bucket; confirm it is private.
3. Designate staff by exact email/user IDs. Each staff member must set up their own
   password and verified TOTP. Configure INTAKE_STAFF_IDS with exact UUIDs. Confirm
   non-staff and aal1 sessions receive no data. Test staff login with the owner.
4. Provision ClamAV behind a TLS endpoint that requires a client certificate. Do not
   expose raw port 3310. Keep signatures current; alert on stale signatures/scan
   errors; verify EICAR rejection against the real service. Store cert/key in runtime
   secrets, never the repository. Choose hosting and any cost with the owner.
5. Connect existing IILA mailbox credentials securely. Neither Noha's available
   account registry nor the specific IILA Keychain item provided credentials; the
   Hostinger connector is currently scoped to info@plucogroup.com only. Do not copy
   unrelated mailbox credentials or change the IILA password. Verify SMTP acceptance
   AND received inbox delivery of a clearly marked fictional test.
6. IILA must decide controller postal details, retention days, backup expiry,
   processor regions/terms, safe rights-verification procedure, emergency contact,
   incident response owner, and staff disclosure authority. Replace the draft privacy
   notice and matching form text with the approved concrete policy.
7. Establish encrypted backups plus a restore exercise and key recovery procedure.
   Retain each encryption key securely for all ciphertext using it. Current v1 has
   one master key: do not rotate it without a re-encryption/key-version migration.
8. Schedule and monitor the maintenance operator job only after retention approval.
   Dry-run: npm run intake:maintenance. Apply: npm run intake:maintenance -- --apply.
   It retries notifications, removes abandoned uploads after 24h, and purges expired
   non-held cases (storage first, then rows). Deletion from provider backups is
   governed by the approved provider expiry policy, not immediate database deletion.
   Legal holds are operator-managed in the database; no staff UI for holds yet.
9. Complete real staged upload, DB persistence, staff access, notification delivery,
   removal/restore and security review, then record evidence. Set verification flags
   only after those checks; never bypass a failed dependency to enable collection.
10. Deploy production, verify same-origin restrictions at https://iila-swiss.org,
    run a final fictional full-flow test, then enable public collection.

## Required runtime settings (server-only; never VITE_*)
SUPABASE_URL, SUPABASE_SECRET_KEY, SUPABASE_PUBLISHABLE_KEY,
INTAKE_ENCRYPTION_KEY (32 random bytes as 64 hex characters),
INTAKE_SESSION_KEY (a separate 32-byte random hex secret),
INTAKE_STAFF_IDS (comma-separated exact user UUIDs),
INTAKE_CLAMAV_HOST, INTAKE_CLAMAV_PORT, INTAKE_CLAMAV_CA if privately issued,
INTAKE_CLAMAV_CLIENT_CERT, INTAKE_CLAMAV_CLIENT_KEY,
INTAKE_SMTP_PASSWORD, INTAKE_ORIGIN=https://iila-swiss.org,
INTAKE_PRIVACY_VERSION, INTAKE_RETENTION_DAYS,
INTAKE_SECURITY_VERIFIED=true, INTAKE_MAIL_VERIFIED=true,
INTAKE_COLLECTION_ENABLED=true.

No secrets have been created or committed. Production origin collection remains
closed unless all required configuration and explicit verification flags are set.

## Remaining product limits
- Latest 100 cases are searchable locally by reference/date/status. Category search,
  pagination, reviewed exports and a full legal-hold/deletion UI remain future work.
- Gregorian exact dates are ISO YYYY-MM-DD; Persian/approximate dates are preserved
  as stated, with their calendar, rather than silently converted inaccurately.
- The availability/config endpoint checks private storage, schema and scanner.
  Server upload independently scans every image and fails closed.
- This implementation has not had an independent penetration test or an IILA legal
  privacy review. Passing these tests does not certify absolute confidentiality.
