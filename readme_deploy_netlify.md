# Netlify Deployment (OpenNext)

This site deploys Next.js using OpenNext instead of the Netlify Next.js plugin.

This avoids the Forms migration bug in @netlify/plugin-nextjs v5.

## How it works
- Netlify runs: `npm run netlify`
- That runs: `npx open-next build`
- Output goes to: `.open-next`
- Netlify serves that folder

## Files
- netlify.toml → OpenNext config
- package.json → netlify script + plugin
- .open-next → build output

## Why
Netlify’s native Next.js plugin is currently broken for sites that don’t use their Forms system.
OpenNext gives full Next.js support without Netlify’s plugin.
