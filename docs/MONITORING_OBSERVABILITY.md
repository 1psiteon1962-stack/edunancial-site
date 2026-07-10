# Monitoring & Observability

## Architecture overview
The application now uses a centralized observability layer in `/src/lib/observability` for:
- structured JSON logging (`logger.ts`)
- structured error logging (`errors.ts`)
- request tracing (`tracing.ts`)
- in-memory request metrics with Prometheus output (`metrics.ts`)
- health payload helpers (`health.ts`)
- environment-driven log-level configuration (`config.ts`)

`/src/middleware.ts` injects/propagates request IDs (`x-request-id`, `x-correlation-id`) for API and admin export requests.

`/src/instrumentation.ts` captures process-level uncaught exceptions and unhandled promise rejections.

## Endpoints
- `GET /api/health` — combined health view (liveness + readiness)
- `GET /api/health/live` — liveness probe
- `GET /api/health/ready` — readiness probe (returns `503` when not ready)
- `GET /api/uptime` — lightweight uptime probe for external uptime monitors
- `GET /api/metrics` — Prometheus-style metrics output

## Audit logging
Audit events are emitted through `/src/lib/auditLog.ts` with:
- `actor`
- `action`
- `target`
- `result`
- `timestamp`
- optional `requestId` + metadata

Implemented audit hooks:
- authentication and authorization outcome for `GET /admin/kpi/export`
- admin export action success/failure for `GET /admin/kpi/export`
- contract acceptance events for `POST /api/contracts/accept`

## Request tracing behavior
- Incoming request IDs are reused when present.
- Missing IDs are generated server-side.
- IDs are returned in response headers:
  - `x-request-id`
  - `x-correlation-id`
- Request IDs are included in API JSON responses where applicable.

## Log levels by environment
Default behavior (`LOG_LEVEL` can override):
- `development`: `debug`
- `staging`: `info`
- `production`: `info`

## Environment variables
Documented in `.env.example`:
- `MONITORING_ENV`
- `LOG_LEVEL`
- `REQUIRE_AIRTABLE_FOR_READINESS`
- `ADMIN_METRICS_TOKEN`
- existing Airtable and region variables

## Cloud readiness notes
- Logs are emitted as single-line JSON for cloud log collectors.
- Metrics are exposed in Prometheus text format and can be scraped by sidecars/agents.
- Current metrics store is in-memory; for multi-instance cloud deployment, wire this module to an external backend (Prometheus remote write, OTLP/OpenTelemetry collector, or managed cloud monitoring).

## Local verification
1. Install dependencies: `npm ci`
2. Build: `npm run build`
3. Start dev server: `npm run dev`
4. Verify endpoints:
   - `curl -i http://localhost:3000/api/health`
   - `curl -i http://localhost:3000/api/health/live`
   - `curl -i http://localhost:3000/api/health/ready`
   - `curl -i http://localhost:3000/api/uptime`
   - `curl -i http://localhost:3000/api/metrics`
5. Trigger API calls and inspect JSON logs in server output for `requestId`, `level`, and structured fields.
