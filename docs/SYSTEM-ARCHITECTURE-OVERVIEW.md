# System Architecture Overview

## Runtime shape
- **Frontend**: Next.js 15 App Router with React 19 and TypeScript
- **Styling**: Tailwind CSS with some legacy inline-style components
- **Deployment target**: Netlify with Next.js plugin
- **Public routes**: content, education, calculators, membership marketing, and dashboard placeholders

## Core application layers
### Presentation
- `src/app/**` provides route entrypoints and page metadata
- `src/components/**` holds shared UI, learning, membership, payments, and SEO components

### Domain and integration layer
- `src/lib/**` contains calculators, KPI logic, auth/session placeholders, payment helpers, CMS integration, and shared configuration
- `functions/**` contains Netlify-oriented helper scripts for checkout and region resolution

### Security and runtime hardening
- `middleware.ts` applies shared headers, marks sensitive routes as non-indexable, and protects admin surfaces when configured
- `src/lib/api/security.ts` centralizes payload parsing, sanitization, API headers, and simple rate limiting
- `src/lib/auth/require-admin.ts` centralizes token-based admin checks

## Key business domains
- **CMS/content**: `src/lib/cms`, `src/lib/api`, `lib/hygraph.ts`
- **Payments**: `src/lib/square.ts`, `src/lib/squareCheckout.ts`, `src/app/api/square/checkout/route.ts`
- **Learning and assessment**: route groups under `src/app/courses`, `assessment`, `dashboard`, and related `src/lib` engines
- **Contracts and trust**: `src/lib/contracts/**`, legal/trust route pages, contract acceptance API
- **KPI / analytics**: `src/lib/kpi/**`, `src/app/api/kpi/**`

## Current architectural constraints
- Member auth is still placeholder-based
- Admin protection is token-driven instead of identity-provider-backed
- Many route files and utility files remain broadly distributed rather than domain-consolidated
