# Netlify Deployment (OpenNext)

This repo deploys Next.js on Netlify using OpenNext to avoid Netlify Next plugin v5 Forms migration issues.

## Key Files
- netlify.toml → uses `netlify-plugin-opennext`
- package.json → script `npm run netlify` runs `npx open-next build`
- Output folder: `.open-next`

## Deploy
Netlify build command:
- `npm run netlify`

Publish directory:
- `.open-next`
