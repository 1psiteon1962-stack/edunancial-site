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

## Global regional architecture

All seven world regions now have a complete structural foundation under `src/app/`:

| Region | Route(s) | Segments | Status |
|---|---|---|---|
| North America | `/north-america` | — | COMPLETE |
| Europe | `/europe` | `/europe/2a` (Western), `/europe/2b` (Central & Eastern) | COMPLETE |
| Latin America | `/latin-america` | `/latin-america/segment-a` (Mexico & Central America), `/latin-america/segment-b` (South America) | COMPLETE |
| Caribbean | `/caribbean` | — | COMPLETE |
| Africa | `/africa` | — | COMPLETE |
| Middle East | `/middle-east` | — | COMPLETE |
| Asia-Pacific | `/asia-pacific` | — | COMPLETE |

Each regional route provides a curriculum-ready structural foundation capable of receiving Red, White, and Blue curriculum at levels 1–5. No curriculum content is loaded; these are architecture-only pages.

### Data layer
- `lib/regions.config.ts` — typed region registry including all seven global regions and their sub-segments
- `lib/regionContent.ts` — hero content descriptors for all regions
- `src/lib/regions.ts` — full region manifest with country lists, languages, and route paths

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

## Security-relevant platform configuration
- `src/app/robots.ts` blocks crawling for `/admin`, `/api`, and `/dashboard`.
- Security headers are configured via `_headers`.

## Current production-readiness caveats
- Many admin routes are present as UI scaffolds/placeholders and are not connected to persistent backend workflows.
- KPI export currently relies on mock CSV data (`src/lib/kpi/adminQueries.ts`).
- Multiple CMS integrations exist; deployment should standardize on one production content source.
- All regional routes outside North America are disabled (`enabled: false`) in `lib/regions.config.ts` pending activation decisions.
