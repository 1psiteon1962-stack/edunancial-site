// ─── Infrastructure Monitoring Types ────────────────────────────────────────

export type ServiceStatus = "healthy" | "degraded" | "down" | "unknown";

export interface MetricSample {
  timestamp: number; // unix ms
  value: number;
  unit: string;
}

export interface ServiceHealthCheck {
  service: string;
  status: ServiceStatus;
  latencyMs: number;
  checkedAt: number;
  message?: string;
  details?: Record<string, unknown>;
}

export interface ServerMetrics {
  serverId: string;
  hostname: string;
  cpuPercent: number;
  memoryPercent: number;
  diskPercent: number;
  networkLatencyMs: number;
  uptimeSeconds: number;
  timestamp: number;
}

export interface ApiEndpointMetrics {
  endpoint: string;
  method: string;
  requestsPerMinute: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  errorRate: number; // 0–1
  timestamp: number;
}

export interface DatabaseMetrics {
  databaseId: string;
  queryLatencyMs: number;
  slowQueryCount: number;
  connectionPoolUsed: number;
  connectionPoolMax: number;
  errorRate: number;
  replicationLagMs?: number;
  timestamp: number;
}

export interface QueueMetrics {
  queueName: string;
  depth: number;
  consumerCount: number;
  processingRatePerSecond: number;
  failedJobCount: number;
  oldestJobAgeSeconds: number;
  timestamp: number;
}

export interface BackgroundJobMetrics {
  jobName: string;
  lastRunAt: number;
  lastRunDurationMs: number;
  lastRunStatus: "success" | "failed" | "running" | "skipped";
  successRate: number; // 0–1
  nextScheduledAt?: number;
}

export interface InfrastructureSnapshot {
  capturedAt: number;
  servers: ServerMetrics[];
  services: ServiceHealthCheck[];
  apis: ApiEndpointMetrics[];
  databases: DatabaseMetrics[];
  queues: QueueMetrics[];
  backgroundJobs: BackgroundJobMetrics[];
  overallStatus: ServiceStatus;
}

// ─── Observability Integration Points ─────────────────────────────────────────

export interface ObservabilityEvent {
  id: string;
  type: "error" | "exception" | "slow_query" | "trace_span" | "performance";
  service: string;
  severity: "critical" | "error" | "warning" | "info";
  message: string;
  timestamp: number;
  traceId?: string;
  spanId?: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
}

export interface DistributedTrace {
  traceId: string;
  rootService: string;
  startTime: number;
  endTime: number;
  totalDurationMs: number;
  spans: TraceSpan[];
  hasError: boolean;
}

export interface TraceSpan {
  spanId: string;
  parentSpanId?: string;
  service: string;
  operation: string;
  startTime: number;
  durationMs: number;
  status: "ok" | "error";
  tags?: Record<string, string>;
}

// ─── Metrics Provider Interface (extension point) ─────────────────────────────

export interface MetricsProvider {
  name: string;
  fetchSnapshot(): Promise<InfrastructureSnapshot>;
  fetchTimeSeries(
    metric: string,
    from: number,
    to: number,
    resolution: "1m" | "5m" | "1h" | "1d"
  ): Promise<MetricSample[]>;
  fetchObservabilityEvents(
    from: number,
    to: number,
    filter?: Partial<ObservabilityEvent>
  ): Promise<ObservabilityEvent[]>;
  fetchTrace(traceId: string): Promise<DistributedTrace | null>;
}
