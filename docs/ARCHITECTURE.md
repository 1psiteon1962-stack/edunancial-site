# Architecture

## Current stack
- **Framework**: Next.js 15 App Router (`src/app`)
- **Language**: TypeScript + React 19
- **Styling**: Tailwind CSS
- **Hosting target**: Netlify (`netlify.toml`)

## Runtime architecture
- **UI pages** are implemented as App Router routes under `src/app/**/page.tsx`.
- **Shared layout** is in `src/app/layout.tsx` and applies SEO metadata, JSON-LD organization schema, and global navigation/footer components.
- **API endpoints** are App Router route handlers under `src/app/**/route.ts|js`.
- **Static/public assets** live in `public/`.
- **Configuration/data artifacts** live in `data/` and legacy helper functions in `functions/`.
- **Regional rollout foundation** is configuration-first in `src/lib/regionalization/apacFoundation.ts`, which now drives APAC country, locale, currency, pricing, tax, compliance, SEO, and launch-control metadata from one module.

## Global regional foundation architecture
- Regional architecture scaffolding is centralized in `src/lib/global-region-foundation.ts`.
- Canonical foundation routes are under `src/app/regions/**`:
  - `GET /regions` (global regional index)
  - `GET /regions/:region`
  - `GET /regions/:region/:track/:level`
- Required region foundations currently scaffolded:
  - `north-america`
  - `europe`
  - `latin-america`
  - `caribbean`
  - `africa`
  - `middle-east`
  - `asia-pacific`
- Track/level scaffolding is route-only and content-free:
  - Tracks: `red`, `white`, `blue`
  - Levels: `level-1` through `level-5`
- No curriculum content is loaded from this architecture layer; it exists only as structural routing and typed configuration for future integration.

## Integrations and data sources
The current implementation supports environment-driven integrations, with safe fallbacks in code:
- Supabase admin client (`lib/kpi/supabaseAdmin.ts`)
- Hygraph (`lib/hygraph.ts`)
- Strapi/CMS fetchers (`src/lib/api/home.ts`, `src/lib/cms/fetchHomepageData.ts`)
- Square client-side config (`src/lib/square.ts`)

## API surface (implemented)
- `POST /api/contracts/accept`
- `GET /api/health`
- `POST /api/kpi`
- `POST /api/kpi/track`
- `POST /api/square/checkout`
- `GET /admin/kpi/export`
- `GET|POST /api/cms/content`
- `GET /api/cms/content/:lessonId/versions`
- `GET /api/cms/content/:lessonId/localization`
- `GET|POST /api/cms/media`

## Security-relevant platform configuration
- `src/app/robots.ts` blocks crawling for `/admin`, `/api`, and `/dashboard`.
- Security headers are configured via `_headers`.
- APAC rollout remains **private by default**: `APAC_FOUNDATION_FLAGS` and per-country `launchControls` default public access to off, with founder/beta audiences separately gated.

## Current production-readiness caveats
- Many admin routes are present as UI scaffolds/placeholders and are not connected to persistent backend workflows.
- KPI export currently relies on mock CSV data (`src/lib/kpi/adminQueries.ts`).
- Multiple CMS integrations exist; deployment should standardize on one production content source.
