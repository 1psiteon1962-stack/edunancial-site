# Deployment

## Deployment target
The repository is currently configured for **Netlify + Next.js plugin** deployment.

## Source of truth
- Build config: `netlify.toml`
- Redirects: `_redirects`, `public/_redirects`
- Headers: `_headers`

## Build configuration
`netlify.toml` currently sets:
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: `18`
- Plugin: `@netlify/plugin-nextjs`

## Required checks before deploy
1. Install dependencies:
   - `npm ci`
2. Build production bundle:
   - `npm run build`
3. Verify env vars in Netlify (see `docs/ENVIRONMENT-VARIABLES.md`).
4. Validate redirects/headers behavior in Deploy Preview.

## Post-deploy smoke checks
- `GET /api/health` returns `200` and JSON body with `ok: true`.
- Core pages load (`/`, `/about`, `/courses`, `/membership`, `/contact`).
- Admin crawl blocking remains active (`/robots.txt`).
- Checkout endpoint responds (`POST /api/square/checkout`).
