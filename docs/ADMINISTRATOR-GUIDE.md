# Administrator Guide

## Admin entry points
- Admin home: `/admin`
- Dashboard: `/admin/dashboard`
- Global Curriculum CMS dashboard: `/admin/cms`
- KPI dashboard: `/admin/kpi`
- KPI CSV export: `/admin/kpi/export`

## Current behavior
- The admin area currently provides scaffolded pages for many modules (books, courses, pricing, customers, etc.).
- KPI export endpoint returns CSV and is suitable for operational checks.

## Operational checks
1. Confirm admin pages load without runtime errors.
2. Validate `/admin/kpi` data rendering behavior.
3. Download and verify CSV from `/admin/kpi/export`.

## Access and security notes
- Crawlers are blocked from `/admin` via `robots.ts`.
- Implement authentication/authorization gates before production use of sensitive admin workflows.
