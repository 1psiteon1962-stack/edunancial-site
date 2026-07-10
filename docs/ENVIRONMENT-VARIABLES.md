# Environment Variables

This file documents environment variables referenced by the current implementation.

## Required in production (feature-dependent)

| Variable | Used in | Purpose |
|---|---|---|
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | `src/app/layout.tsx` | Google Search Console site verification meta tag |
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/kpi/supabaseAdmin.ts` | Supabase project URL for KPI/admin data access |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/kpi/supabaseAdmin.ts` | Service key for server-side Supabase access |
| `STRAPI_API_URL` | `src/lib/api/home.ts` | Strapi API base URL |
| `STRAPI_API_TOKEN` | `src/lib/api/home.ts` | ****** for Strapi API |
| `HYGRAPH_ENDPOINT` | `lib/hygraph.ts` | Hygraph GraphQL endpoint |
| `HYGRAPH_TOKEN` | `lib/hygraph.ts` | Hygraph bearer token |
| `CMS_BASE_URL` | `src/lib/cms/fetchHomepageData.ts` | CMS base URL for homepage data fetch |
| `NEXT_PUBLIC_SQUARE_APPLICATION_ID` | `src/lib/square.ts` | Square client application ID |
| `NEXT_PUBLIC_SQUARE_LOCATION_ID` | `src/lib/square.ts` | Square location ID |
| `NEXT_PUBLIC_SQUARE_ENVIRONMENT` | `src/lib/square.ts` | Square environment (`production` default) |
| `SITE_REGION` | `src/lib/regionRuntime.ts` | Runtime region selector |

## Variables currently present in `.env.example`

| Variable | Purpose |
|---|---|
| `AIRTABLE_API_KEY` | Airtable integration credential |
| `AIRTABLE_BASE_ID` | Airtable base identifier |
| `AIRTABLE_TABLE_LEADS` | Airtable leads table name |
| `AIRTABLE_TABLE_EVENTS` | Airtable events table name |
| `ADMIN_METRICS_TOKEN` | Admin metrics token |
| `NEXT_PUBLIC_DEFAULT_REGION` | Default region fallback |

## Notes
- Public variables (`NEXT_PUBLIC_*`) are exposed to client bundles.
- Keep secrets (`SUPABASE_SERVICE_ROLE_KEY`, API tokens) server-only.
- Current code includes fallback behavior for some missing variables, but production should not rely on fallbacks.
