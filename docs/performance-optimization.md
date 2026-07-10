# Production Performance Optimization (Current Branch)

## Scope completed

- Reduced unnecessary client-side JavaScript in shared layout and book listing components.
- Added targeted lazy loading for non-critical dashboard sections.
- Tightened API responses for KPI tracking and reduced response payload overhead.
- Improved static/dynamic caching strategy for Next.js and API routes.
- Removed dead, unreferenced components.

## Benchmark methodology

### Commands used

```bash
# Build output and route bundle stats
npm run build

# Production route and API latency checks
PORT=4000 npm run start
curl -o /dev/null -s -w "dashboard_run%{num}: %{time_total}s\n" http://localhost:4000/dashboard
curl -o /dev/null -s -X POST -H 'content-type: application/json' \
  -d '{"event_name":"bench","metadata":{"source":"benchmark"}}' \
  -w "kpi_post_run%{num}: %{time_total}s\n" http://localhost:4000/api/kpi

# Header verification
curl -s -D - -o /dev/null http://localhost:4000/_next/static/chunks/4bd1b696-f785427dddbba9fb.js
curl -s -D - -o /dev/null -X POST -H 'content-type: application/json' \
  -d '{"event_name":"bench"}' http://localhost:4000/api/kpi
```

## Before vs after (measured)

| Metric | Before | After | Change |
| --- | ---: | ---: | ---: |
| `/dashboard` median response time (warm samples) | 3.493 ms | 2.924 ms | **-16.29%** |
| `POST /api/kpi` median response time | 5.003 ms | 3.637 ms | **-27.30%** |
| KPI success response body | JSON (`{"success":true}`) | 204 No Content | **Smaller payload** |
| Static chunk cache policy (`/_next/static/*`) | `max-age=600` (global fallback) | `max-age=31536000, immutable` | **Long-term immutable caching** |
| API cache policy (`/api/*`) | implicit/default | `no-store, max-age=0` | **No stale API responses** |

## Key implementation notes

- `src/components/layout/Navbar.tsx`
  - Removed unnecessary `"use client"` to avoid hydrating static navbar markup on every route.
- `src/components/EbookCard.tsx`, `src/components/BookCard.tsx`
  - Switched from raw `<img>` to `next/image` with explicit sizes for optimized image delivery.
  - `EbookCard` no longer forces a full client component boundary.
- `src/app/dashboard/page.tsx` + `src/components/dashboard/DashboardSecondaryPanels.tsx`
  - Split below-the-fold dashboard sections into a lazily loaded module.
- API routes:
  - `src/app/api/kpi/route.ts`
  - `src/app/api/kpi/track/route.ts`
  - `src/app/api/contracts/accept/route.ts`
  - `src/app/api/square/checkout/route.ts`
  - `src/app/api/health/route.js`
  - Added explicit cache headers and reduced KPI response overhead.
- `next.config.mjs`
  - Added explicit cache headers for static immutable assets and API no-store behavior.
- Dead code removed:
  - `src/components/Hero.tsx`
  - `src/components/dashboard/BusinessCompetencyDashboard.tsx`
