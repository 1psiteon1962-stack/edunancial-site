# Netlify Production Checklist

**Branch:** `audit/north-america-launch-readiness`  
**Audit date:** 2026-07-16  
**Auditor:** Copilot Coding Agent

---

## Build Configuration

| Item | Status | Notes |
|---|---|---|
| Build command | ✅ | `npm run build` |
| Publish directory | ✅ | `.next` |
| Node.js version | ✅ | 22 (set in `netlify.toml` and `.nvmrc`) |
| `@netlify/plugin-nextjs` installed | ✅ | Registered in `netlify.toml` |
| Production build completes | ✅ | Verified: `npm run build` exits 0; 457 pages generated |
| TypeScript errors | ✅ None | `npx tsc --noEmit` exits 0 |
| Lint errors | ✅ None | Only pre-existing `<img>` warnings (not errors) |
| Netlify forms disabled | ✅ | `NETLIFY_NEXT_PLUGIN_SKIP_FORMS=true` in `netlify.toml` |

---

## Environment Variables

All variables must be set in the Netlify UI under **Site settings → Environment variables**.  
**Never commit values to the repository.**

### Required for production

| Variable | Required | Default | Notes |
|---|---|---|---|
| `NODE_VERSION` | ✅ | `22` | Set in `netlify.toml` |
| `SQUARE_ACCESS_TOKEN` | ✅ | — | Square production access token |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | ✅ | — | Square webhook HMAC key |
| `SQUARE_WEBHOOK_NOTIFICATION_URL` | ✅ | `https://www.edunancial.com/api/square/webhook` | Must match URL registered in Square Dashboard |
| `SQUARE_VERIFIED_CHECKOUT_ENABLED` | ✅ | `false` | Set to `true` only after Square config is verified |
| `NEXT_PUBLIC_SQUARE_APPLICATION_ID` | ✅ | — | Square application ID |
| `NEXT_PUBLIC_SQUARE_LOCATION_ID` | ✅ | — | Square location ID |
| `NEXT_PUBLIC_SQUARE_ENVIRONMENT` | ✅ | `production` | Use `sandbox` for staging |
| `ADMIN_METRICS_TOKEN` | ✅ | — | Long random string for `/api/admin/kpi/export` auth |
| `MONITORING_ENV` | recommended | `production` | Passed to observability logger |
| `LOG_LEVEL` | recommended | `warn` | In production use `warn` or `error` |

### Optional / feature-gated

| Variable | Purpose | Notes |
|---|---|---|
| `NEXT_PUBLIC_TRIAL_MEMBERSHIP_ENABLED` | Enables trial membership public visibility | Default `false`; only set to `true` for launch campaigns |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console ownership token | Optional for launch |
| `AIRTABLE_API_KEY` | Airtable lead capture | Required only if Airtable integration is used |
| `AIRTABLE_BASE_ID` | Airtable base | Required with `AIRTABLE_API_KEY` |
| `AIRTABLE_TABLE_LEADS` | Airtable leads table name | Default: `Leads` |
| `AIRTABLE_TABLE_EVENTS` | Airtable events table name | Default: `Events` |
| `REQUIRE_AIRTABLE_FOR_READINESS` | Make `/api/health/ready` return 503 if Airtable absent | Default `false` |
| `NEXT_PUBLIC_DEFAULT_REGION` | Default region code | Default `us` |
| `SITE_REGION` | Server-side region override | Default `us` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server-side) | Do not use `NEXT_PUBLIC_` prefix |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | |
| `CMS_BASE_URL` | CMS API base URL | Optional |
| `STRAPI_API_URL` | Strapi base URL | Optional |
| `STRAPI_API_TOKEN` | Strapi token | Server-side only |
| `HYGRAPH_ENDPOINT` | Hygraph GraphQL endpoint | Optional |
| `HYGRAPH_TOKEN` | Hygraph token | Server-side only |

### Security rules

- ✅ `SQUARE_ACCESS_TOKEN` must **not** use a `NEXT_PUBLIC_` prefix (server-side only)
- ✅ `SQUARE_WEBHOOK_SIGNATURE_KEY` must **not** use a `NEXT_PUBLIC_` prefix
- ✅ `ADMIN_METRICS_TOKEN` must **not** use a `NEXT_PUBLIC_` prefix
- ✅ `SUPABASE_SERVICE_ROLE_KEY` must **not** use a `NEXT_PUBLIC_` prefix
- ✅ `STRAPI_API_TOKEN` and `HYGRAPH_TOKEN` must **not** use a `NEXT_PUBLIC_` prefix
- ⚠️ `NEXT_PUBLIC_SQUARE_APPLICATION_ID` and `NEXT_PUBLIC_SQUARE_LOCATION_ID` are safe to expose (Square design intent)

---

## Netlify Plugin: `@netlify/plugin-nextjs`

| Item | Status | Notes |
|---|---|---|
| Plugin installed | ✅ | `package.json` devDependencies |
| Plugin registered in `netlify.toml` | ✅ | `[[plugins]]` block present |
| Server functions generated | ✅ | Verified in build output (ƒ Dynamic routes) |
| Image optimization | ✅ | Next.js `<Image>` handled by plugin |
| Route handlers deployed as functions | ✅ | API routes compile and deploy as Netlify functions |

---

## Headers and Security

| Item | Status | File | Notes |
|---|---|---|---|
| `Content-Security-Policy` | ✅ Fixed | `_headers` | Updated in this branch to include Square domains; removed PayPal (not in use) |
| `Referrer-Policy` | ✅ | `_headers` | `no-referrer-when-downgrade` |
| `X-Content-Type-Options` | ✅ | `_headers` | `nosniff` |
| `X-Frame-Options` | ✅ | `_headers` | `SAMEORIGIN` |
| `Strict-Transport-Security` | ✅ | `_headers` | 2-year max-age with preload |
| `Cache-Control` | ✅ | `_headers` | `public, max-age=600` (10 min) |
| HTTPS enforced | ✅ | HSTS header + Netlify HTTPS auto-provision | |
| Admin routes blocked from indexing | ✅ | `robots.ts` | `/admin`, `/api`, `/dashboard`, `/member`, `/account`, `/profile`, `/settings`, `/payment/success`, `/payment/cancel` |

---

## Redirects

| Item | Status | File | Notes |
|---|---|---|---|
| `/* /index.html 200` Netlify SPA rewrite | ✅ | `_redirects` | Required for client-side routing fallback |
| Custom domain redirects | ❓ | Netlify UI | Must configure `www` → apex or apex → `www` in Netlify |
| HTTPS redirect | ✅ Auto | Netlify | Automatic |

---

## Domain Configuration

| Item | Status | Notes |
|---|---|---|
| Custom domain `edunancial.com` | ❓ Must configure in Netlify UI | |
| `www.edunancial.com` | ❓ Must configure redirect in Netlify UI | Recommend: `www` → apex |
| SSL certificate | ✅ Auto (Let's Encrypt) | Provisioned by Netlify |
| Production domain in metadata | ✅ | `https://www.edunancial.com` (in `layout.tsx`, `robots.ts`, `sitemap.ts`) |
| Production domain in Square webhook URL env var | ⚠️ Manual | Must set `SQUARE_WEBHOOK_NOTIFICATION_URL=https://www.edunancial.com/api/square/webhook` |
| Production domain in Square Dashboard | ⚠️ Manual | Redirect URLs must be whitelisted in Square Dashboard |

---

## Webhook Routes

| Item | Status | Notes |
|---|---|---|
| `/api/square/webhook` POST handler | ✅ | Exists and is compiled |
| Webhook HMAC verification | ✅ | `verifySquareWebhookSignature()` uses `timingSafeEqual` |
| Webhook gated behind feature flag | ✅ | Returns 503 unless `SQUARE_VERIFIED_CHECKOUT_ENABLED=true` |
| Webhook rate limiting | ✅ | 120 requests/minute per IP |
| Webhook registered in Square Dashboard | ⚠️ Manual | Must register `https://www.edunancial.com/api/square/webhook` in Square Developer Dashboard |

---

## Deploy Previews

| Item | Status | Notes |
|---|---|---|
| Deploy previews enabled | ✅ Auto (Netlify) | Each PR/branch generates a preview URL |
| Preview URL domain in payments | ⚠️ | Square checkout redirect_url uses `request.url` origin — works automatically for previews |
| Square sandbox for previews | Recommended | Set `NEXT_PUBLIC_SQUARE_ENVIRONMENT=sandbox` on non-production contexts |

---

## Next Steps Before Going Live

1. **Set all required environment variables** in Netlify UI (see table above).
2. **Enable HTTPS** and confirm `www` redirect in Netlify domain settings.
3. **Register Square webhook** at `https://www.edunancial.com/api/square/webhook` in Square Developer Dashboard.
4. **Whitelist return URLs** in Square Dashboard: `https://www.edunancial.com/payment/success`.
5. **Test Square sandbox end-to-end**: place a test order, verify webhook fires, verify success page loads.
6. **Set `SQUARE_VERIFIED_CHECKOUT_ENABLED=true`** after verifying the above.
7. **Verify `/api/health/ready`** returns 200 in production.
8. **Submit sitemap** to Google Search Console: `https://www.edunancial.com/sitemap.xml`.
9. **Confirm deploy preview** looks correct before merging to main.
10. **Set `MONITORING_ENV=production`** and `LOG_LEVEL=warn` in production environment.
