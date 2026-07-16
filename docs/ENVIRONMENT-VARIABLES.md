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

## Secure admin content upload portal

| Variable | Used in | Purpose |
|---|---|---|
| `EDUNANCIAL_ADMIN_EMAIL` | `src/lib/admin-content/auth.ts` | Owner-only admin login identity |
| `EDUNANCIAL_ADMIN_PASSWORD_HASH` | `src/lib/admin-content/auth.ts` | Server-side scrypt password hash |
| `EDUNANCIAL_ADMIN_SESSION_SECRET` | `src/lib/admin-content/auth.ts` | HMAC signing key for secure admin sessions |
| `EDUNANCIAL_UPLOAD_STORAGE_KEY` | `src/lib/admin-content/storage/index.ts` | Supabase storage bucket for admin uploads and exports |
| `EDUNANCIAL_GITHUB_TOKEN` | `src/lib/admin-content/github.ts` | Server-only GitHub token for branch/PR creation |
| `EDUNANCIAL_GITHUB_OWNER` | `src/lib/admin-content/github.ts` | GitHub owner used by the export integration |
| `EDUNANCIAL_GITHUB_REPO` | `src/lib/admin-content/github.ts` | GitHub repository used by the export integration |
| `EDUNANCIAL_GITHUB_BASE_BRANCH` | `src/lib/admin-content/github.ts` | Base branch for content-upload pull requests |
