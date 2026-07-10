# Netlify deployment (Next.js plugin)

This project is currently deployed on Netlify using the Next.js runtime plugin.

## Source of truth
- `netlify.toml`
- `_headers`
- `_redirects`
- `public/_redirects`

## Build settings
Netlify executes:
- `npm run build`

Configured publish directory:
- `.next`

Configured plugin:
- `@netlify/plugin-nextjs`

## Notes
- This repository is not currently configured for `open-next` in scripts.
- Keep this README aligned with `netlify.toml` when deployment settings change.
