# Deployment Guide

## Requirements
- Node.js 20
- npm compatible with the checked-in lockfile
- Netlify site configured with the Next.js plugin

## Required environment variables
- `ADMIN_METRICS_TOKEN`
- `NEXT_PUBLIC_DEFAULT_REGION`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (optional if not in use)
- `CMS_BASE_URL`
- `STRAPI_API_URL`
- `STRAPI_API_TOKEN`
- `HYGRAPH_ENDPOINT`
- `HYGRAPH_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SQUARE_APPLICATION_ID`
- `NEXT_PUBLIC_SQUARE_LOCATION_ID`
- `NEXT_PUBLIC_SQUARE_ENVIRONMENT`
- `SITE_REGION`

## Deployment steps
1. Install dependencies with `npm install`
2. Run `npm run lint`
3. Run `npm test`
4. Run `npm run build`
5. Confirm `/api/health` returns `status: ok`
6. Verify Netlify environment variables are populated
7. Deploy the default branch

## Post-deploy checks
- Open the homepage, key marketing routes, membership pages, and dashboard placeholders
- Verify admin routes redirect to `/admin/access` when protection is enabled
- Verify payment CTA flows still route to the expected checkout experience
- Validate security headers in the deployed response

## Rollback
- Re-deploy the previous successful Netlify build
- Re-run `/api/health`
- Re-verify admin access gating and payment CTA flows
