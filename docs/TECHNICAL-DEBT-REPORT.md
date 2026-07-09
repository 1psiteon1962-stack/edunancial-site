# Technical Debt Report

## Critical
- **Real authentication and authorization**: member and admin experiences still rely on placeholder session assumptions outside the new admin token gate.
- **Durable server-side persistence**: KPI tracking and contract acceptance are validated, but they still do not persist to a production datastore.

## High
- **Automated test coverage**: the repository now exposes a validation command, but functional coverage for user journeys, payments, and dashboards still needs to be added.
- **Observability**: the app lacks a structured logging sink, alert routing, and production dashboards.
- **Route sprawl**: public, member, and admin pages are numerous and not yet grouped with strong feature ownership.

## Medium
- **Large page components**: several routes remain long and should be decomposed into reusable feature modules.
- **Manual sitemap maintenance**: current sitemap entries are static and can drift from real route inventory.
- **Mixed styling strategies**: some components still rely on inline styles alongside Tailwind utility classes.

## Nice-to-have
- Introduce explicit barrel exports for core domains
- Add richer health/readiness probes for third-party dependencies
- Add image asset dimension metadata centrally to reduce repeated literals

## Future architecture recommendations
- Move auth, CMS, KPI, and payments behind domain-focused adapters
- Add a backend-for-frontend layer for third-party integrations
- Introduce cache tags/revalidation contracts for CMS and catalog content
