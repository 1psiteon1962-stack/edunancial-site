# North America Security Phase 2

Scope: production readiness for the United States and Canada. This work must not expand regional/language scope or weaken curriculum/deployment validation.

## Existing baseline

`next.config.mjs` already applies HSTS, nosniff, strict-origin referrer policy, DENY framing, a restrictive permissions policy, opener isolation, DNS-prefetch disabling, no-store API caching, and disables the powered-by header.

## Staged controls

1. **CSP inventory and report-only rollout**
   - Inventory every production origin required by Supabase, Square, Netlify, analytics, media/video, AI and any customer-support widget.
   - Start with report-only policy. Do not enforce a guessed allowlist.
   - Prefer CSP `frame-ancestors 'none'`; retain X-Frame-Options as defense in depth.
   - Enforce only after checkout, authentication, curriculum, uploads/media, analytics and admin workflows pass production validation.

2. **Authorization negative tests**
   - Inventory public, member, admin and executive routes.
   - Automated tests must prove anonymous users cannot access member/admin data; members cannot access another user's records; non-admin members cannot access admin/executive routes; client-supplied role claims cannot elevate privilege.

3. **Abuse/rate controls**
   - Protect authentication, password reset, checkout creation, webhooks, contact forms, uploads, AI coach, translation agents and expensive/write APIs.
   - Prefer a shared production-capable limiter; do not rely on per-process memory for distributed/serverless enforcement.
   - Return 429 with safe retry guidance and never leak account existence.

4. **Upload security**
   - Server-side size/count limits; extension + MIME + file-signature validation; normalized generated storage names; traversal rejection; executable rejection; archive depth/expanded-size limits where archives are accepted; private/quarantine storage before publication; malware-scanning integration point; audit and cleanup.

5. **Supabase isolation**
   - Review RLS and storage policies. Service-role credentials must remain server-only and narrowly used.
   - Add anonymous/member/owner/admin negative tests and cross-user ownership tests.

6. **Square/payment security**
   - Verify webhook signatures against the raw request body; reject stale/invalid signatures; idempotently process event IDs; validate product/plan/amount server-side; do not trust browser price/tier; do not store card data; redact payment tokens/secrets from logs.

7. **Secrets and CI**
   - Keep production, preview and development credentials separate.
   - Least-privilege GitHub Actions permissions; dependency/security scanning; secret scanning/push protection where available; no secrets in client bundles, logs, curriculum or translation prompts.

8. **Audit/recovery/incident readiness**
   - Structured redacted security events for repeated auth failures, privilege changes, webhook/payment anomalies, upload anomalies and agent failures.
   - Document and test backup/restore for curriculum/configuration and user/business records.
   - Maintain incident runbooks for credential compromise, account takeover, data exposure, malicious upload, payment incident, dependency compromise and rollback/recovery.

## North America acceptance gate

Before materially increasing U.S./Canada payment volume, verify production-domain TLS/headers/cookies, authentication and authorization boundaries, Square webhook integrity/idempotency, RLS isolation, rate limiting on sensitive endpoints, restore capability and an external authenticated/unauthenticated penetration test with severity-based remediation.
