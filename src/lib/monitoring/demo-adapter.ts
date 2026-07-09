import {
  type InfrastructureSnapshot,
  type MetricSample,
  type ObservabilityEvent,
  type DistributedTrace,
  type ServiceStatus,
  type MetricsProvider,
} from "./types";

// ─── Deterministic Demo Metrics Provider ─────────────────────────────────────
// Provides realistic, time-varying demo data without external dependencies.
// Replace with a real provider by implementing MetricsProvider and passing it
// to the monitoring service via setProvider().

function jitter(base: number, pct: number): number {
  const range = base * pct;
  return base + (Math.random() * range * 2 - range);
}

function overallStatus(snapshot: Omit<InfrastructureSnapshot, "overallStatus">): ServiceStatus {
  const statuses = snapshot.services.map((s) => s.status);
  if (statuses.some((s) => s === "down")) return "down";
  if (statuses.some((s) => s === "degraded")) return "degraded";
  if (statuses.some((s) => s === "unknown")) return "unknown";
  return "healthy";
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export class DemoMetricsProvider implements MetricsProvider {
  name = "demo";

  async fetchSnapshot(): Promise<InfrastructureSnapshot> {
    const now = Date.now();

    const servers = [
      { serverId: "web-01", hostname: "web-01.edunancial.internal", cpuPercent: jitter(34, 0.15), memoryPercent: jitter(61, 0.08), diskPercent: jitter(42, 0.04), networkLatencyMs: jitter(2.1, 0.2), uptimeSeconds: 2_592_000 + Math.floor(Math.random() * 86400) },
      { serverId: "web-02", hostname: "web-02.edunancial.internal", cpuPercent: jitter(28, 0.15), memoryPercent: jitter(58, 0.08), diskPercent: jitter(44, 0.04), networkLatencyMs: jitter(1.9, 0.2), uptimeSeconds: 2_678_400 + Math.floor(Math.random() * 86400) },
      { serverId: "api-01", hostname: "api-01.edunancial.internal", cpuPercent: jitter(52, 0.15), memoryPercent: jitter(74, 0.08), diskPercent: jitter(31, 0.04), networkLatencyMs: jitter(1.3, 0.2), uptimeSeconds: 1_728_000 + Math.floor(Math.random() * 86400) },
      { serverId: "worker-01", hostname: "worker-01.edunancial.internal", cpuPercent: jitter(19, 0.2), memoryPercent: jitter(45, 0.08), diskPercent: jitter(55, 0.04), networkLatencyMs: jitter(2.5, 0.2), uptimeSeconds: 3_110_400 + Math.floor(Math.random() * 86400) },
    ].map((s) => ({ ...s, timestamp: now }));

    const services = [
      { service: "web-frontend", status: "healthy" as ServiceStatus, latencyMs: jitter(38, 0.2), checkedAt: now },
      { service: "api-gateway", status: "healthy" as ServiceStatus, latencyMs: jitter(12, 0.2), checkedAt: now },
      { service: "auth-service", status: "healthy" as ServiceStatus, latencyMs: jitter(9, 0.2), checkedAt: now },
      { service: "payment-service", status: "healthy" as ServiceStatus, latencyMs: jitter(45, 0.2), checkedAt: now },
      { service: "course-engine", status: "healthy" as ServiceStatus, latencyMs: jitter(22, 0.2), checkedAt: now },
      { service: "notification-service", status: "degraded" as ServiceStatus, latencyMs: jitter(320, 0.3), checkedAt: now, message: "Elevated latency detected" },
      { service: "search-indexer", status: "healthy" as ServiceStatus, latencyMs: jitter(18, 0.2), checkedAt: now },
      { service: "cdn", status: "healthy" as ServiceStatus, latencyMs: jitter(5, 0.2), checkedAt: now },
    ];

    const apis = [
      { endpoint: "/api/courses", method: "GET", requestsPerMinute: jitter(420, 0.15), avgLatencyMs: jitter(28, 0.2), p95LatencyMs: jitter(89, 0.2), p99LatencyMs: jitter(210, 0.3), errorRate: 0.002 },
      { endpoint: "/api/auth/login", method: "POST", requestsPerMinute: jitter(85, 0.2), avgLatencyMs: jitter(45, 0.2), p95LatencyMs: jitter(120, 0.2), p99LatencyMs: jitter(280, 0.3), errorRate: 0.005 },
      { endpoint: "/api/payments", method: "POST", requestsPerMinute: jitter(12, 0.3), avgLatencyMs: jitter(310, 0.2), p95LatencyMs: jitter(620, 0.2), p99LatencyMs: jitter(980, 0.3), errorRate: 0.001 },
      { endpoint: "/api/users/profile", method: "GET", requestsPerMinute: jitter(210, 0.15), avgLatencyMs: jitter(18, 0.2), p95LatencyMs: jitter(55, 0.2), p99LatencyMs: jitter(120, 0.3), errorRate: 0.001 },
    ].map((a) => ({ ...a, timestamp: now }));

    const databases = [
      { databaseId: "primary-postgres", queryLatencyMs: jitter(4.2, 0.2), slowQueryCount: Math.floor(jitter(3, 0.5)), connectionPoolUsed: Math.floor(jitter(18, 0.2)), connectionPoolMax: 50, errorRate: 0.001, replicationLagMs: jitter(12, 0.5) },
      { databaseId: "replica-postgres", queryLatencyMs: jitter(5.8, 0.2), slowQueryCount: Math.floor(jitter(1, 0.5)), connectionPoolUsed: Math.floor(jitter(8, 0.2)), connectionPoolMax: 50, errorRate: 0.001, replicationLagMs: jitter(22, 0.5) },
      { databaseId: "cache-redis", queryLatencyMs: jitter(0.8, 0.2), slowQueryCount: 0, connectionPoolUsed: Math.floor(jitter(5, 0.2)), connectionPoolMax: 20, errorRate: 0 },
    ].map((d) => ({ ...d, timestamp: now }));

    const queues = [
      { queueName: "email-delivery", depth: Math.floor(jitter(14, 0.5)), consumerCount: 3, processingRatePerSecond: jitter(4.2, 0.2), failedJobCount: Math.floor(jitter(1, 1)), oldestJobAgeSeconds: jitter(8, 0.5) },
      { queueName: "course-progress-sync", depth: Math.floor(jitter(52, 0.3)), consumerCount: 2, processingRatePerSecond: jitter(12, 0.2), failedJobCount: 0, oldestJobAgeSeconds: jitter(3, 0.5) },
      { queueName: "payment-webhooks", depth: Math.floor(jitter(4, 0.5)), consumerCount: 1, processingRatePerSecond: jitter(0.8, 0.2), failedJobCount: 0, oldestJobAgeSeconds: jitter(2, 0.5) },
    ].map((q) => ({ ...q, timestamp: now }));

    const backgroundJobs = [
      { jobName: "daily-backup", lastRunAt: now - 3_600_000, lastRunDurationMs: 42_000, lastRunStatus: "success" as const, successRate: 0.98, nextScheduledAt: now + 82_800_000 },
      { jobName: "sitemap-generator", lastRunAt: now - 7_200_000, lastRunDurationMs: 8_200, lastRunStatus: "success" as const, successRate: 1.0, nextScheduledAt: now + 79_200_000 },
      { jobName: "email-digest", lastRunAt: now - 1_800_000, lastRunDurationMs: 12_500, lastRunStatus: "success" as const, successRate: 0.99, nextScheduledAt: now + 84_600_000 },
      { jobName: "analytics-rollup", lastRunAt: now - 900_000, lastRunDurationMs: 3_800, lastRunStatus: "failed" as const, successRate: 0.92, nextScheduledAt: now + 3_600_000 },
      { jobName: "cache-warmup", lastRunAt: now - 300_000, lastRunDurationMs: 1_200, lastRunStatus: "success" as const, successRate: 1.0, nextScheduledAt: now + 300_000 },
    ];

    const partial = { capturedAt: now, servers, services, apis, databases, queues, backgroundJobs };
    return { ...partial, overallStatus: overallStatus(partial) };
  }

  async fetchTimeSeries(
    metric: string,
    from: number,
    to: number,
    resolution: "1m" | "5m" | "1h" | "1d"
  ): Promise<MetricSample[]> {
    const resolutionMs: Record<string, number> = { "1m": 60_000, "5m": 300_000, "1h": 3_600_000, "1d": 86_400_000 };
    const stepMs = resolutionMs[resolution] ?? 300_000;
    const samples: MetricSample[] = [];
    const baseValues: Record<string, [number, string]> = {
      cpu: [35, "%"],
      memory: [62, "%"],
      disk: [43, "%"],
      api_latency: [28, "ms"],
      error_rate: [0.3, "%"],
      requests_per_minute: [380, "req/min"],
    };
    const [base, unit] = baseValues[metric] ?? [50, "units"];
    for (let ts = from; ts <= to; ts += stepMs) {
      samples.push({ timestamp: ts, value: jitter(base, 0.2), unit });
    }
    return samples;
  }

  async fetchObservabilityEvents(
    from: number,
    to: number,
    _filter?: Partial<ObservabilityEvent>
  ): Promise<ObservabilityEvent[]> {
    const events: ObservabilityEvent[] = [
      { id: makeId(), type: "slow_query", service: "course-engine", severity: "warning", message: "Query exceeded 500ms threshold", timestamp: Date.now() - 120_000, durationMs: 720, metadata: { query: "SELECT * FROM enrollments WHERE ...", database: "primary-postgres" } },
      { id: makeId(), type: "error", service: "notification-service", severity: "error", message: "Email delivery failed: SMTP timeout", timestamp: Date.now() - 300_000, metadata: { retryCount: 3 } },
      { id: makeId(), type: "performance", service: "api-gateway", severity: "info", message: "P99 latency spike to 480ms on /api/courses", timestamp: Date.now() - 600_000, durationMs: 480 },
      { id: makeId(), type: "exception", service: "payment-service", severity: "error", message: "Unhandled promise rejection in webhook processor", timestamp: Date.now() - 900_000, metadata: { handled: false } },
    ].filter((e) => e.timestamp >= from && e.timestamp <= to);
    return events;
  }

  async fetchTrace(traceId: string): Promise<DistributedTrace | null> {
    const now = Date.now();
    return {
      traceId,
      rootService: "api-gateway",
      startTime: now - 200,
      endTime: now,
      totalDurationMs: 200,
      hasError: false,
      spans: [
        { spanId: makeId(), service: "api-gateway", operation: "HTTP GET /api/courses", startTime: now - 200, durationMs: 200, status: "ok" },
        { spanId: makeId(), parentSpanId: "root", service: "course-engine", operation: "getCourseList", startTime: now - 180, durationMs: 160, status: "ok" },
        { spanId: makeId(), parentSpanId: "course-engine", service: "primary-postgres", operation: "SELECT courses", startTime: now - 160, durationMs: 18, status: "ok" },
      ],
    };
  }
}

// ─── Active provider ──────────────────────────────────────────────────────────

let _provider: MetricsProvider = new DemoMetricsProvider();

export function setMetricsProvider(provider: MetricsProvider): void {
  _provider = provider;
}

export function getMetricsProvider(): MetricsProvider {
  return _provider;
}
