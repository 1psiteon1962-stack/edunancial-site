# Production Operations Guide

## Health and readiness checks
- `GET /api/health` should return `status: ok`
- Confirm homepage and primary conversion routes render successfully
- Inspect security headers and CSP on deployed responses

## Monitoring expectations
- Track deployment health, build failures, and payment-flow regressions
- Watch for repeated 429 responses on public APIs as a signal of abuse or misconfigured clients
- Review admin access issues separately from member-experience issues

## Operational runbook
1. Validate health endpoint
2. Check the latest deployment/build output
3. Confirm environment configuration for impacted integrations
4. Reproduce the issue on the smallest relevant route
5. Roll back if the issue affects payments, admin access, or core navigation

## Backup-readiness notes
- Keep environment variables and third-party credentials managed in the hosting provider
- Maintain export/backups for CMS, legal copy, and analytics data in their source systems
- Add durable database backup policy once KPI and contract events are persisted
