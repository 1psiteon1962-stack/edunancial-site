# Infrastructure Operations Platform

## Overview

This repository now includes an enterprise operations foundation centered on `/admin/operations` and reusable modules under `/src/lib/operations`.
The implementation is cloud-agnostic by default: adapters are typed, demo-safe, and ready to be replaced by vendor-specific providers for metrics, observability, notifications, and backup execution.

## Architecture

### Runtime surfaces
- `GET /api/health` — overall health snapshot with service and backup summaries.
- `GET /api/health/readiness` — readiness probe aligned with future load balancers, rolling deployments, and Kubernetes readiness checks.
- `GET /api/health/liveness` — liveness heartbeat for container orchestration.
- `GET /api/operations/dashboard` — typed operational dashboard payload.
- `GET /api/operations/logs` — structured log feed with query, severity, and event-type filtering.
- `/admin/operations` — operator dashboard with monitoring, observability, alerting, logs, backup state, DR posture, and runbooks.

### Domain modules
- `src/lib/operations/types.ts` — typed models for metrics, services, logs, alerts, backups, DR policy, and dashboard payloads.
- `src/lib/operations/metrics.ts` — metrics aggregation and formatting helpers.
- `src/lib/operations/observability.ts` — pluggable observability adapter contract plus API latency and slow-query hook helpers.
- `src/lib/operations/logging.ts` — structured logging schema creation, validation, filtering, and sensitive-field redaction.
- `src/lib/operations/alerts.ts` — alert rule models and threshold evaluation.
- `src/lib/operations/backups.ts` — backup scheduling, execution, verification, and restore-test state transitions.
- `src/lib/operations/disasterRecovery.ts` — RTO/RPO policy, failover readiness checklist, and operator runbook.
- `src/lib/operations/demoProvider.ts` — demo-safe provider used when live infrastructure integrations are unavailable.

## Monitoring architecture

The dashboard models the following monitoring domains:
- server CPU, memory, and disk utilization
- API availability and latency
- database latency / slow query posture
- network latency
- background job health
- queue depth
- active users
- backup success posture

### Extending providers
1. Replace the demo provider with infrastructure-specific collectors.
2. Preserve the `MetricsProviderResult` contract so aggregation and alert evaluation remain stable.
3. Keep service identifiers stable (`public-api`, `primary-database`, etc.) so dashboards and alerting do not require UI rewrites.

## Observability standards

The observability layer is prepared for:
- error tracking
- performance monitoring
- distributed tracing
- API latency analysis
- slow query detection
- exception reporting

`ObservabilityAdapter` is intentionally minimal so future integrations can forward telemetry to OpenTelemetry, Datadog, New Relic, Sentry, Grafana, or cloud-native backends without changing page logic.

## Logging standards

Structured log events include:
- event type
- severity
- message
- correlation ID
- request ID
- actor
- resource
- timestamp
- context payload
- redacted field list

Sensitive keys such as `password`, `token`, `secret`, `authorization`, `cookie`, `card`, `cvv`, `ssn`, and `apiKey` are redacted before storage or display.

### Retention policy abstraction
The current implementation models hot retention, cold retention, and archive storage class in a provider-neutral way.
Map these fields to your actual storage lifecycle policies when implementing a live log backend.

## Backup strategy

### Protected resources
- primary databases
- user uploads and course assets
- configuration exports and CMS content

### Supported controls
- scheduled backup cadence
- geographic redundancy readiness
- point-in-time recovery modeling
- verification status
- restore test status

### Restore testing workflow
1. Execute the relevant backup run.
2. Verify the snapshot using `verifyBackupExecution`.
3. Run restore smoke tests and record the result with `recordRestoreTest`.
4. Confirm `/api/health`, `/api/health/readiness`, and key business flows before marking the drill complete.

## Disaster recovery procedures

### Targets
- **RTO:** 45 minutes
- **RPO:** 15 minutes

### Failover checklist
1. Declare incident and freeze deployments.
2. Assess blast radius and protect write paths.
3. Promote standby region and shift traffic.
4. Validate auth, payment, content delivery, and queue recovery.
5. Publish recovery summary and follow-up actions.

## High availability readiness

The current implementation is aligned for future:
- multi-region traffic steering
- rolling deployments
- blue/green deployment cutovers
- health-based load balancing
- Kubernetes readiness/liveness integration
- autoscaling signals based on queue depth, latency, and resource utilization

## Incident response workflow

Use the in-dashboard runbook as the single operator summary during incidents.
Every incident should capture correlation IDs from health checks, logs, and alert events so responders can trace impact across services.

## Environment contract

Operational environment variables are documented in `.env.example` and include placeholders for provider selection, log retention, backup cadence defaults, and alert routing destinations.

## Validation

Recommended repository validation commands:
- `npm run lint`
- `npm test`
- `npm run build`
