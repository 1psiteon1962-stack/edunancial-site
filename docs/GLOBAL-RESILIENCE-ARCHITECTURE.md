# Global Resilience Architecture

## Governing rule
Build globally, activate regionally. A failure in one region, locale, provider, content batch, payment rail, video job, or marketing adapter must not corrupt shared source data or make healthy regions unavailable.

## Isolation boundaries
- Region: activation and health are independent per region.
- Provider: payment, marketing, video and email adapters fail independently.
- Content: immutable/versioned records; publishing changes an active pointer rather than destroying prior versions.
- Locale: a failed translation remains staged/failed and cannot replace a healthy published locale.
- Jobs: asynchronous queues use scoped jobs, bounded retries and dead-letter handling.
- Media: immutable object-storage assets are referenced by durable IDs.
- Deployment: application builds deploy software only; operational content publishing must not require a Netlify build.

## Regional control plane
Each region has activation status, health status, versioned configuration and service-level circuit breakers. North America is initially active. Other regions may be configured and validated while inactive, then promoted to pilot/active without changing the application architecture.

## Failure behavior
1. Never silently fall an identified region into another region's pricing, tax or payment configuration.
2. If a regional service is unhealthy, open only that region/service circuit.
3. Preserve read access to already-published durable content whenever safe.
4. Queue retryable work; quarantine poison jobs after bounded retries.
5. Never roll back or delete healthy content in another region because one regional batch failed.
6. Configuration activation is atomic and versioned; the previous known-good version remains recoverable.
7. Shared platform failures must degrade optional features before core learning access.

## Activation gate
A region moves inactive -> pilot -> active only after configuration validation for countries, locales, currency/pricing, payments, tax/legal configuration, content availability, monitoring and rollback. Pausing a region does not alter another region.

## Launch posture
North America (US/Canada) is the first active region. Latin America and Caribbean can be prepared next. Europe, Africa, Middle East and Asia Pacific remain independently configurable and inactive until approved.
