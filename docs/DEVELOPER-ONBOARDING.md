# Developer Onboarding Guide

## Prerequisites
- Node.js 18+
- npm 10+

## Local setup
1. Install dependencies:
   - `npm ci`
2. Create local environment file from `.env.example`.
3. Start development server:
   - `npm run dev`
4. Build production bundle locally:
   - `npm run build`

## Repository structure
- `src/app/` — Next.js App Router pages and API routes
- `src/components/` — reusable UI components
- `src/lib/` and `lib/` — integration and domain helpers
- `data/` — static/content configuration JSON files
- `docs/` — project and release-readiness documentation

## Validation workflow
- Build is the current non-interactive CI-safe baseline: `npm run build`.
- `npm run lint` currently prompts interactive ESLint setup if no config exists.

## First tasks for new contributors
- Confirm local build passes.
- Review `docs/ARCHITECTURE.md`, `docs/API-DOCUMENTATION.md`, and `docs/DEPLOYMENT.md`.
- Use small, focused PRs (especially for docs-only changes).
