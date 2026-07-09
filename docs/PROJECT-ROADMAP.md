# Edunancial Project Roadmap

## Near-term priorities
1. Replace placeholder member session logic with a real auth provider and role model.
2. Persist KPI, contract-acceptance, and audit events to durable infrastructure.
3. Expand automated quality coverage from type safety to route, component, and browser flows.

## Medium-term priorities
1. Break large page modules into smaller feature sections with clearer ownership boundaries.
2. Consolidate the broad `src/lib` surface into domain barrels for payments, CMS, KPI, auth, and learning systems.
3. Introduce structured logging, alerting, and dashboarding for launch operations.

## Future architecture recommendations
1. Move admin, member, and public concerns behind explicit route groups and access boundaries.
2. Introduce backend-for-frontend adapters for CMS, payments, and analytics integrations.
3. Add cache tagging and revalidation strategy for CMS and catalog content.
