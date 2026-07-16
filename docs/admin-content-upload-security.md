# Admin Content Upload Security

## Authentication and session controls
- Owner-only login uses `EDUNANCIAL_ADMIN_EMAIL` and `EDUNANCIAL_ADMIN_PASSWORD_HASH`.
- Admin sessions are signed server-side with `EDUNANCIAL_ADMIN_SESSION_SECRET`.
- Session cookies are `HttpOnly`, production `Secure`, and `SameSite=Lax`.
- Login attempts are rate-limited.

## CSRF protection
State-changing routes require:
- a valid signed admin session
- a matching CSRF cookie + `x-csrf-token` header
- a same-origin request check

## Upload protections
- allowlist-only extensions
- executable and HTML/JS rejection
- MIME sniffing for common binary formats
- per-file and per-batch size limits
- filename normalization and traversal rejection
- ZIP bomb protections (count, size, duplicate entry, compression-ratio, traversal, symlink, and password-protected archive checks)

## Preview safety
- uploaded text is shown as escaped/plain-text preview
- markdown is reduced to a safe text preview instead of inline HTML rendering
- SVG is not inline-rendered
- nothing is auto-published

## Review and export controls
- every important action writes an audit event
- approved files are exported only after explicit owner action
- GitHub export creates a branch + PR and never pushes to `main`
- curriculum validation blocks GitHub export when fatal curriculum issues are detected
