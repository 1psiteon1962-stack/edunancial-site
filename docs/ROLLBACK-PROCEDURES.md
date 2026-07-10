# Rollback Procedures

## When to roll back
Roll back when a production deployment introduces regressions affecting availability, security, payment initiation, or core user flows.

## Rollback steps (Netlify)
1. Open Netlify deploy history for the production site.
2. Select the most recent known-good deploy.
3. Trigger **Publish deploy** for that version.
4. Verify environment variables are unchanged from expected production values.

## Validation after rollback
- Confirm `/api/health` is healthy.
- Confirm primary site routes load correctly.
- Confirm `POST /api/square/checkout` returns a successful response.
- Confirm no CSP or redirect regressions from `_headers` and `_redirects`.

## Communication
- Record rollback timestamp and deploy IDs.
- Post an incident update with impact summary and corrective actions.
