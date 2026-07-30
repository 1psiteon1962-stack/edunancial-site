# Administrator Guide

## Admin entry points
- Admin home: `/admin`
- Admin login: `/admin/login`
- Owner (executive) login: `/executive/login`
- Executive dashboard (owner-only): `/executive/dashboard`
- Dashboard: `/admin/dashboard`
- Global Curriculum CMS dashboard: `/admin/cms`
- Course management: `/admin/courses`
- User & role management: `/admin/users`
- Membership management: `/admin/memberships`
- KPI dashboard: `/admin/kpi`
- KPI CSV export: `/admin/kpi/export`

## Role-Based Access Control (RBAC)

| Role | Login page | Access |
|------|-----------|--------|
| `owner` | `/executive/login` | Full platform access, bypasses all paywalls |
| `admin` | `/admin/login` | Full admin access (except owner-only) |
| `editor` | `/admin/login` | Content creation, editing, publish/unpublish |
| `instructor` | `/admin/login` | Content creation and editing (drafts only) |
| `member` | `/login` | Member portal, access governed by tier |
| `guest` | — | Public pages only |

## Initializing the Owner account

See [OWNER-SETUP.md](./OWNER-SETUP.md) for the full initialization guide.

Quick summary:
1. Run `node scripts/generate-owner-credentials.mjs`
2. Set `EDUNANCIAL_OWNER_EMAIL`, `EDUNANCIAL_OWNER_PASSWORD_HASH`, `EDUNANCIAL_ADMIN_SESSION_SECRET` as deployment environment variables
3. Sign in at `/executive/login`

## Current behavior
- The admin area provides course management, user/role management, content upload, KPIs, and membership management.
- KPI export endpoint returns CSV and is suitable for operational checks.

## Operational checks
1. Confirm admin pages load without runtime errors.
2. Validate `/admin/kpi` data rendering behavior.
3. Download and verify CSV from `/admin/kpi/export`.
4. Test owner login at `/executive/login`.

## Access and security notes
- Crawlers are blocked from `/admin` and `/executive` via `robots.ts`.
- Admin sessions are signed with HMAC-SHA256 and stored in `httpOnly` cookies.
- All state-changing admin API calls enforce CSRF token validation.
- Rate limiting: 5 failed login attempts per 15-minute window per IP.
- Audit log: all login events written to `.admin-data/audit-log.json`.
