# Netlify deployment (OpenNext)

This site uses OpenNext instead of Netlify’s broken Next.js plugin.

Why:
@netlify/plugin-nextjs v5 is currently broken due to forced Forms migration.

This repo uses:
- open-next
- netlify-plugin-open-next

Netlify runs:
npm run netlify

Which executes:
npx open-next build

The output is published from:
.open-next
