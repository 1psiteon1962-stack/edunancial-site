# Environment Variables

This file documents environment variables referenced by the current implementation.

## Required in production (feature-dependent)

| Variable | Used in | Purpose |
|---|---|---|
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | `src/app/layout.tsx` | Google Search Console verification |
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/kpi/supabaseAdmin.ts` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/kpi/supabaseAdmin.ts` | Server-side Supabase service key |
| `STRAPI_API_URL` | `src/lib/api/home.ts` | Strapi API base URL |
| `STRAPI_API_TOKEN` | `src/lib/api/home.ts` | Strapi API token |
| `HYGRAPH_ENDPOINT` | `lib/hygraph.ts` | Hygraph GraphQL endpoint |
| `HYGRAPH_TOKEN` | `lib/hygraph.ts` | Hygraph bearer token |
| `CMS_BASE_URL` | `src/lib/cms/fetchHomepageData.ts` | CMS base URL |
| `NEXT_PUBLIC_SQUARE_APPLICATION_ID` | `src/lib/square.ts` | Square application ID |
| `NEXT_PUBLIC_SQUARE_LOCATION_ID` | `src/lib/square.ts` | Square location ID |
| `NEXT_PUBLIC_SQUARE_ENVIRONMENT` | `src/lib/square.ts` | Square environment |
| `SITE_REGION` | `src/lib/regionRuntime.ts` | Runtime region selector |

## Notes
- Public variables (`NEXT_PUBLIC_*`) are exposed to client bundles.
- Keep secrets and service-role keys server-only.
- Production should not rely on fallback values for critical integrations.
