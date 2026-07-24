# Netlify deployment (Next.js plugin)

This project is currently deployed on Netlify using the Next.js runtime plugin.

## Active production site

- **Netlify site name:** `edunancial`
- **Production URL:** `https://edunancial.com`
- **Valid GitHub status context:** `netlify/edunancial/deploy-preview`

No other Netlify site should be connected to this repository.
If stale status checks from `netlify/edunancial-site/deploy-preview` or
`netlify/brilliant-sunflower-2bd9de/deploy-preview` appear on pull requests,
follow the remediation steps in `docs/NETLIFY-INTEGRATION-CLEANUP.md`.

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
