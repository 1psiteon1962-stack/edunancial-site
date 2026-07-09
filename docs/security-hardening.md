# Security hardening

## Implemented controls

- Middleware-enforced security headers, request IDs, CSRF cookie issuance, and admin route RBAC checks
- Signed-session hooks for the existing authentication platform via `x-auth-*` headers or the `edunancial_session` cookie
- Server-side CSRF validation, API payload validation, structured audit logging, monitoring hooks, and in-memory rate limiting for sensitive APIs
- Consent-aware analytics handling through the `edunancial_consent` cookie and `/api/privacy/consent`
- Encryption hooks through `encryptSensitiveValue` / `decryptSensitiveValue`
- Admin-only data breach logging workflow through `/api/admin/security/breach`
- Health/readiness reporting through `/api/health`

## Production environment

Set these values in production:

- `EDUNANCIAL_SESSION_SECRET`
- `EDUNANCIAL_ENCRYPTION_KEY` (base64url-encoded AES key)

Optional tuning:

- `EDUNANCIAL_RATE_LIMIT_BREACH`
- `EDUNANCIAL_RATE_LIMIT_CHECKOUT`
- `EDUNANCIAL_RATE_LIMIT_CONSENT`
- `EDUNANCIAL_RATE_LIMIT_CONTRACTS`
- `EDUNANCIAL_RATE_LIMIT_EXPORTS`
- `EDUNANCIAL_RATE_LIMIT_KPI`

## Integration notes

- Existing auth providers can inject `x-auth-user-id`, `x-auth-role`, `x-auth-email`, and `x-auth-session-id` headers for server-side authorization.
- Sensitive server flows should call the encryption hooks before persisting regulated data.
- Audit and monitoring hooks currently emit structured logs to stdout and can be routed to SIEM or observability sinks.
