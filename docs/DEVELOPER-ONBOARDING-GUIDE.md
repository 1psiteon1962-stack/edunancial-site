# Developer Onboarding Guide

## Local setup
1. Install Node.js 20
2. Run `npm install`
3. Copy `.env.example` into a local `.env.local`
4. Populate only the integrations you need for the workstream
5. Start the app with `npm run dev`

## Validation workflow
- `npm run lint`
- `npm test`
- `npm run build`

## Repository orientation
- `src/app`: route entrypoints and metadata
- `src/components`: reusable UI and feature sections
- `src/lib`: business logic, integrations, and shared configuration
- `docs`: launch, operations, and architecture references

## Working conventions
- Keep changes non-breaking and production-oriented
- Prefer shared helpers for route security and environment handling
- Document any residual risks in the readiness/debt reports
