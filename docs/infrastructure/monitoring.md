# Monitoring Architecture

## Overview

The monitoring platform uses a **provider/adapter pattern** so the admin dashboards and API routes are decoupled from any specific monitoring vendor. This enables seamless swap-in of production telemetry sources.

## Current Architecture

```
Admin Dashboards (RSC)
       │
       ▼
getMetricsProvider()          ← calls the active MetricsProvider
       │
       ├── DemoMetricsProvider  (default — deterministic demo data)
       ├── DatadogProvider      (future — implement MetricsProvider)
       ├── PrometheusProvider   (future)
       └── NewRelicProvider     (future)
```

## MetricsProvider Interface

```typescript
interface MetricsProvider {
  name: string;
  fetchSnapshot(): Promise<InfrastructureSnapshot>;
  fetchTimeSeries(metric, from, to, resolution): Promise<MetricSample[]>;
  fetchObservabilityEvents(from, to, filter?): Promise<ObservabilityEvent[]>;
  fetchTrace(traceId): Promise<DistributedTrace | null>;
}
```

Implement this interface and call `setMetricsProvider(yourProvider)` in your server startup (e.g., `next.config.mjs` instrumentation hook, or a server-side module init).

## Infrastructure Snapshot

`InfrastructureSnapshot` contains a point-in-time capture of:

- **servers** — CPU %, memory %, disk %, network latency, uptime
- **services** — health status, latency for each named service
- **apis** — req/min, avg/P95/P99 latency, error rate per endpoint
- **databases** — query latency, slow query count, connection pool, replication lag
- **queues** — depth, consumers, processing rate, failed jobs
- **backgroundJobs** — last run time/status, success rate, next scheduled run

## Observability Integration Points

### Error Tracking
Implement `fetchObservabilityEvents()` to return `ObservabilityEvent` records of type `error` or `exception`. Wire to Sentry, Rollbar, or Bugsnag via their REST APIs or SDKs.

### Distributed Tracing
Implement `fetchTrace(traceId)` to return `DistributedTrace` objects. Wire to Jaeger, Zipkin, or OpenTelemetry Collector.

### Performance Monitoring
Wire `fetchTimeSeries()` to Datadog, Prometheus/Grafana, or CloudWatch metrics.

### Slow Query Detection
In your database layer, capture queries exceeding your threshold (default: 500ms) and emit them as `ObservabilityEvent` records with `type: "slow_query"`. Set the alert threshold in `src/lib/alerting/rules.ts` rule `ar-010`.

## Metrics Dashboard

The monitoring dashboard at `/admin/monitoring` renders:

1. API endpoint performance table (latency, error rates, throughput)
2. Database performance cards (per-database breakdown)
3. Queue health cards (depth, consumers, processing rate)
4. Observability events timeline (errors, traces, slow queries)
5. Integration readiness panel

## Adding a Vendor Adapter

1. Create `src/lib/monitoring/your-vendor-adapter.ts`
2. Implement `MetricsProvider`
3. In your server startup: `import { setMetricsProvider } from '@/lib/monitoring'; setMetricsProvider(new YourVendorProvider())`
4. The dashboards and API routes automatically use the new provider.
