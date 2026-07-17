# Executive Analytics & KPI Dashboard

## Overview

The Edunancial Executive Dashboard is a secure, owner-only analytics and KPI command center built on top of the Administrator CMS. It provides business intelligence, financial reporting, membership analytics, marketing dashboards, course analytics, AI coach metrics, geographic reporting, and system health monitoring — all protected by strict server-side owner-level authorization.

---

## Architecture

### Authentication & Permission Model

| Role      | Access                                           |
|-----------|--------------------------------------------------|
| `owner`   | Full admin access + all executive analytics      |
| `admin`   | Admin CMS only — no financial or executive data  |

The role is embedded in the signed session cookie (`edunancial_admin_session`) as the `role` field. Session verification is handled server-side using HMAC-SHA256 signing via `src/lib/admin-content/auth.ts`.

**Key functions:**

| Function                    | Location                          | Purpose                                      |
|-----------------------------|-----------------------------------|----------------------------------------------|
| `requireOwnerPageSession()` | `src/lib/admin-content/auth.ts`   | Redirects to `/executive/login` if not owner |
| `requireOwnerApiSession()`  | `src/lib/admin-content/auth.ts`   | Returns 403 if session is not owner          |
| `validateAdminLogin()`      | `src/lib/admin-content/auth.ts`   | Accepts `targetRole: 'owner' | 'admin'`      |
| `createAdminSession()`      | `src/lib/admin-content/auth.ts`   | Accepts `role` parameter                     |

### Routes

| Route                         | Auth Required | Description                             |
|-------------------------------|---------------|-----------------------------------------|
| `/executive/login`            | None          | Owner login page                        |
| `/executive`                  | `owner`       | Redirects to `/executive/dashboard`     |
| `/executive/dashboard`        | `owner`       | Main KPI command center                 |
| `/executive/kpi`              | `owner`       | Know Your Numbers — goals & gauges      |
| `/executive/kpi/export`       | `owner`       | Redirects to CSV export API             |
| `/executive/finance`          | `owner`       | Financial dashboard                     |
| `/executive/analytics`        | `owner`       | Membership & course analytics           |
| `/executive/marketing`        | `owner`       | Marketing analytics                     |
| `/executive/system`           | `owner`       | System health monitoring                |
| `/api/executive/session`      | `owner`       | Session status API                      |
| `/api/executive/auth/login`   | None          | Owner login endpoint (sets role=owner)  |
| `/api/executive/auth/logout`  | None          | Clears session cookie                   |
| `/api/executive/kpi`          | `owner`       | Full KPI snapshot JSON                  |
| `/api/executive/kpi/export`   | `owner`       | CSV export of all KPIs                  |

### Data Layer

All KPI data is served through typed adapter functions in `src/lib/executive/adapters.ts`. Each function returns `MetricValue<T>` objects with a `status` field:

- `"live"` — real data from a connected source
- `"demo"` — sample/placeholder data
- `"pending"` — integration not yet connected

This architecture allows the UI to render safely with clear provenance labels while real data sources are being connected.

---

## Owner Role Setup

### Required Environment Variables

```env
# Owner / Executive credentials
EDUNANCIAL_OWNER_EMAIL=owner@yourdomain.com
EDUNANCIAL_OWNER_PASSWORD_HASH=<scrypt hash>

# Session signing secret (shared with admin, minimum 32 characters)
EDUNANCIAL_ADMIN_SESSION_SECRET=<at-least-32-character-random-string>

# Existing admin credentials (unchanged)
EDUNANCIAL_ADMIN_EMAIL=admin@yourdomain.com
EDUNANCIAL_ADMIN_PASSWORD_HASH=<scrypt hash>
```

### Generating a Password Hash

Use the existing admin utility or run:

```ts
import { hashAdminPassword } from "@/lib/admin-content/auth";
console.log(hashAdminPassword("your-secure-password"));
```

The hash format is `scrypt$<salt>$<derived-key>`.

---

## Supported Data Sources

| Module          | Status           | Integration Point                                   |
|-----------------|------------------|-----------------------------------------------------|
| Revenue         | Pending          | `getRevenueKPIs()` — connect Square/Stripe webhooks |
| Membership      | Pending          | `getMembershipKPIs()` — connect Supabase members    |
| Financial P&L   | Pending          | `getFinancialKPIs()` — connect QuickBooks/Xero      |
| Course Analytics| Pending          | `getCourseKPIs()` — connect Supabase course_progress|
| AI Coach        | Pending          | `getAICoachKPIs()` — connect Supabase ai_conversations|
| Marketing       | Pending          | `getMarketingKPIs()` — connect GA4/LinkedIn/Meta    |
| System Health   | Pending          | `getSystemHealthKPIs()` — connect uptime monitors   |
| Geographic      | Demo (US only)   | `getGeoData()` — connect Supabase geo_analytics     |

---

## Export / Reporting

### CSV Export

Available at:
- Page: `/executive/kpi/export` (redirects after session check)
- API: `GET /api/executive/kpi/export` (requires session cookie)

The CSV includes all KPI sections: Revenue, Membership, Financial, Courses, Marketing.

### Future Integrations

Typed interfaces are defined in `src/lib/executive/export.ts`:

```ts
export interface ExcelExporter {
  buildExecutiveKPIWorkbook(snapshot: ExecutiveSnapshot): Promise<Buffer>;
}

export interface PDFExporter {
  buildExecutiveKPIReport(snapshot: ExecutiveSnapshot): Promise<Buffer>;
}
```

Implement these with `exceljs` (Excel) or `pdfkit`/`puppeteer` (PDF) when needed.

---

## KPI Goals

Goals are defined in `getKPIGoals()` in `src/lib/executive/adapters.ts`. They include:

- Monthly Revenue Goal
- Active Members Goal
- Monthly Traffic Goal
- Course Completion Goal
- Customer Satisfaction Goal
- Monthly Growth Goal
- Annual Growth Goal
- Monthly Net Profit Goal

**Future improvement:** Persist goals in a Supabase `executive_goals` table to allow owner-configurable targets from the dashboard UI.

---

## Executive Notifications (Architecture Ready)

The notification infrastructure follows the same pattern as the existing `src/lib/notifications/` module. Implement alerting for:

- Revenue goal achieved / below target
- High churn detected
- Website offline (system health check failure)
- Payment errors (webhook from payment provider)
- Large membership change (> N% in 24h)

---

## Security

- All executive pages use `requireOwnerPageSession()` — server-side redirect to `/executive/login` on failure
- All executive API routes use `requireOwnerApiSession()` — returns 403 on failure
- No financial data is accessible to standard `admin` role sessions
- Session cookies are `httpOnly`, `secure` (production), `sameSite: lax`
- CSRF protection is enforced on state-changing API calls
- All `/executive/*` routes are covered by `noindex, nofollow` headers and CSP via `src/middleware.ts`
- Rate limiting is applied to the login endpoint

---

## Localization

Executive UI keys are defined in `src/locales/en.json` and `src/locales/es.json` under the `executive.*` namespace. All user-visible strings use the `t()` helper from `useInternationalPreferences()`.

---

## Files

```
src/
├── lib/
│   ├── admin-content/
│   │   ├── auth.ts           # Updated: owner role, requireOwnerPageSession/Api
│   │   └── types.ts          # Updated: AdminRole type, role field on AdminSession
│   └── executive/
│       ├── types.ts          # KPI typed interfaces, MetricValue wrapper
│       ├── adapters.ts       # Safe data adapter functions
│       └── export.ts         # CSV builder, Excel/PDF interfaces
├── components/executive/
│   ├── ExecutiveKPICard.tsx
│   ├── ExecutiveLoginForm.tsx
│   ├── ExecutiveNav.tsx
│   ├── GeoSummaryTable.tsx
│   ├── KPIGaugeCard.tsx
│   └── SystemHealthCard.tsx
└── app/
    ├── api/executive/
    │   ├── session/route.ts
    │   ├── auth/login/route.ts
    │   ├── auth/logout/route.ts
    │   ├── kpi/route.ts
    │   └── kpi/export/route.ts
    └── executive/
        ├── layout.tsx
        ├── page.tsx           # Redirects to /executive/dashboard
        ├── login/page.tsx
        ├── dashboard/page.tsx
        ├── kpi/page.tsx
        ├── kpi/export/page.tsx
        ├── finance/page.tsx
        ├── analytics/page.tsx
        ├── marketing/page.tsx
        └── system/page.tsx
src/locales/
├── en.json   # Added executive.* keys
└── es.json   # Added executive.* keys (Spanish)
src/middleware.ts              # Updated: covers /executive/* routes
```

---

## Known Blockers

| Item                        | Status        | Notes                                          |
|-----------------------------|---------------|------------------------------------------------|
| Live revenue data           | Pending       | Requires payment provider webhook integration |
| Live membership data        | Pending       | Requires Supabase members schema               |
| Live financial data         | Pending       | Requires accounting API integration           |
| Live course analytics       | Pending       | Requires Supabase course_progress table        |
| Live marketing data         | Pending       | Requires GA4/LinkedIn/Meta API keys           |
| Live system health          | Pending       | Requires uptime monitor integration           |
| Goal persistence            | Pending       | Requires Supabase executive_goals table        |
| Excel/PDF export            | Pending       | Interfaces defined; implementation pending     |
| Executive notifications     | Pending       | Architecture ready; alerting rules TBD         |
| Geographic breakdown        | Demo only     | Requires Supabase geo_analytics table          |

---

## Recommended Next Steps

1. Create `EDUNANCIAL_OWNER_EMAIL` and `EDUNANCIAL_OWNER_PASSWORD_HASH` in Netlify environment variables
2. Connect Supabase membership tables to `getMembershipKPIs()`
3. Connect payment provider (Square/Stripe) webhooks to `getRevenueKPIs()`
4. Implement `executive_goals` Supabase table for configurable KPI targets
5. Add GA4 integration to `getMarketingKPIs()`
6. Implement live system health checks (Supabase status API, Netlify status API)
