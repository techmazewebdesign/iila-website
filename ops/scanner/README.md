# IILA private scanner deployment (prepared, not activated)

For a dedicated Ubuntu 24.04 host with an owner-approved location and sufficient memory (plan for 4 GB RAM). No host is currently connected. These files have not been executed on a production server. Do not use a public upload-analysis service, expose plaintext clamd, or run the production scanner on the owner's laptop. ClamAV software is free; a suitable always-on host is still required. Keep Firebase on Spark.

## Network and data handling

The public TCP3310 listener requires both a trusted client certificate and its exact pinned leaf certificate. It forwards only to clamd on loopback TCP3311. Never publish3311. Use host/provider firewall and restrict3310 to application egress where stable addresses are available. Images stream to the scanner over TLS; no case fields, original filenames or applicant identities are sent. Clamd temporary spooling uses a64MiB RAM filesystem. It keeps no submitted evidence. Freshclam downloads signature updates outbound; clamd reloads via its local socket. Keep host time synchronized.

## Operator preparation

On the operator machine, generate PKI outside the repository after choosing the actual scanner DNS hostname:

```sh
node scripts/scanner-certificates.mjs scanner.example.org /protected/new-directory
```

The generator refuses to overwrite existing keys, makes its directory0700/private files0600, and creates separate server/client certificate roles with90-day validity. Keep ca.key and client.key off the scanner host. Save the CA private key and a recovery copy offline. The client-trust.pem bundle pins the application client leaf certificate as well as trusting its dedicated CA. Rotate before90days, update the pin and application setting together, and test the rollover. Do not paste keys into chat, source control or logs.

## Dedicated host installation

Review paths and package availability on the actual host first. Installing packages/replacing daemon configuration is intended only for the dedicated host, not a machine already providing other services. Copy ops/scanner configuration files over the owner's authenticated SSH connection. Install Ubuntu's clamav-daemon, clamav-freshclam and stunnel4 packages. Use systemd-timesyncd or the host's existing synchronized clock.

Create a locked system user/group named iila-scanner. Install clamd.conf and stunnel.conf under/etc/iila-scanner, owned by root. Place only server.pem, server.key and client-trust.pem there; server.key must be root:iila-scanner0640, directory root:iila-scanner0750. Public certificate files may be0644. Do not copy ca.key or client.key to this host.

Disable the package's stock clamav-daemon service/socket before starting the provided dedicated iila-clamd.service; preserve existing services if this is not a new dedicated host. Install both supplied units into/etc/systemd/system and reload systemd. Leave clamav-freshclam.service enabled, with its standard database directory/var/lib/clamav and notification socket/run/clamav/clamd.ctl. Initial signature download must complete before scanning can work. Enable/start iila-clamd.service and iila-scanner-tls.service. Confirm only127.0.0.1:3311 serves plaintext and3310 serves certificate-authenticated TLS. Inspect service errors without logging file contents.

Verify stunnel version supports verifyChain/verifyPeer/requireCert; do not remove any verification to work around errors. Run systemd-analyze verify on the installed units and check ClamAV starts with every supplied option. Deployment files are prepared here; service startup/config compatibility remains unverified until a host exists.

## Application settings and real acceptance test

Use the protected settings file to add INTAKE_CLAMAV_HOST, optional PORT(default3310), CA(ca.pem), CLIENT_CERT(client.pem), CLIENT_KEY(client.key). Keep server private key and CA private key out of Vercel. Save only the client's runtime material as sensitive server-only Vercel settings. No VITE_ prefixes.

Run from the operator machine against the real hostname:

```sh
node scripts/verify-scanner.mjs /protected/intake-settings.json
```

This sends only fictional clean bytes and the harmless EICAR antivirus test string. It requires a trusted hostname/certificate, current loaded signatures (at most48hours old, no more than5minutes in the future), acceptance of clean data, rejection of EICAR, and rejection without client credentials. Every network exchange has an absolute8second deadline. It never prints credentials or submitted data. A local TLS test double is not proof of a real antivirus engine.

Then repeat through the actual hosted API with a fictional valid image, demonstrate rejection of a valid image carrying the antivirus test signature, confirm encrypted persistence/no public reads, staff MFA read/download, reference-only inbox delivery and recovery/restore. Email SMTP and actual inbox delivery already passed separately. Verify staff enrolment and operational recovery before setting SECURITY_VERIFIED and COLLECTION_ENABLED true. Deploy to production only after the real checks pass. No submitted case automatically expires.

## Sources

- https://docs.clamav.net/manual/Installing/Docker.html (official images and long-running daemon context)
- https://docs.clamav.net/manual/Usage/ClamdProtocol.html (VERSION, INSTREAM and plaintext-network restriction)
- https://www.stunnel.org/auth.html (mutual TLS, verification and certificate pinning)
