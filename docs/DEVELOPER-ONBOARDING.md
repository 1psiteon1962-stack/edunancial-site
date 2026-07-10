# Developer Onboarding Guide

## Prerequisites
- Node.js 18+
- npm 10+

## Local setup
1. Install dependencies with `npm ci`.
2. Create a local environment file from `.env.example`.
3. Start the development server with `npm run dev`.
4. Build the production bundle locally with `npm run build`.

## Repository structure
- `src/app/` — Next.js App Router pages and API routes
- `src/components/` — reusable UI components
- `src/lib/` and `lib/` — integration and domain helpers
- `data/` — static/content configuration JSON files
- `docs/` — project and release-readiness documentation

## Validation workflow
- Build is the current non-interactive CI-safe baseline: `npm run build`.
- Type checking is available with `npx tsc --noEmit`.

## First tasks for new contributors
- Confirm the local build passes.
- Review `docs/ARCHITECTURE.md`, `docs/API-DOCUMENTATION.md`, and `docs/DEPLOYMENT.md`.
- Use small, focused pull requests.
