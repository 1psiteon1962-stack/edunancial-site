import {
  InstrumentationAdapterDescriptor,
  ObservabilityInsightPanel,
  ServiceHealth,
  StructuredLogEvent,
} from "@/lib/operations/types";

export interface ObservabilityAdapter {
  descriptor: InstrumentationAdapterDescriptor;
  captureApiLatency(route: string, durationMs: number): void;
  captureError(name: string, message: string): void;
  captureTrace(spanName: string, durationMs: number): void;
  captureSlowQuery(queryName: string, durationMs: number): void;
}

export class DemoObservabilityAdapter implements ObservabilityAdapter {
  descriptor: InstrumentationAdapterDescriptor = {
    id: "demo-observability",
    name: "Demo observability adapter",
    status: "demo",
    capabilities: [
      "error-tracking",
      "latency-monitoring",
      "distributed-tracing",
      "slow-query-detection",
      "exception-reporting",
    ],
  };

  captureApiLatency() {}

  captureError() {}

  captureTrace() {}

  captureSlowQuery() {}
}

export function buildObservabilityPanels(services: ServiceHealth[], logs: StructuredLogEvent[]): ObservabilityInsightPanel[] {
  const apiService = services.find((service) => service.id === "public-api");
  const dbService = services.find((service) => service.category === "database");
  const criticalLogs = logs.filter((event) => event.severity === "critical").length;

  return [
    {
      id: "api-latency",
      title: "API latency analysis",
      status: apiService?.latencyMs && apiService.latencyMs > 250 ? "warning" : "healthy",
      summary: `P95 latency is ${apiService?.latencyMs ?? 0} ms across the public API.`,
      actions: ["Investigate upstream dependency latency", "Review autoscaling queue depth"],
    },
    {
      id: "slow-query-detection",
      title: "Slow query detection",
      status: dbService?.latencyMs && dbService.latencyMs > 200 ? "warning" : "healthy",
      summary: `Primary database latency is ${dbService?.latencyMs ?? 0} ms with indexed query safeguards enabled.`,
      actions: ["Review query plan regressions", "Validate read replica saturation"],
    },
    {
      id: "exception-reporting",
      title: "Exception reporting",
      status: criticalLogs > 0 ? "warning" : "healthy",
      summary: `${criticalLogs} critical exception events require operator acknowledgement.`,
      actions: ["Triage correlated incidents", "Attach post-incident timeline to runbook"],
    },
  ];
}

export function createApiLatencyHook(adapter: ObservabilityAdapter, route: string, durationMs: number) {
  adapter.captureApiLatency(route, durationMs);
  return {
    route,
    durationMs,
    capturedAt: new Date().toISOString(),
  };
}

export function createSlowQueryHook(adapter: ObservabilityAdapter, queryName: string, durationMs: number) {
  adapter.captureSlowQuery(queryName, durationMs);
  return {
    queryName,
    durationMs,
    capturedAt: new Date().toISOString(),
  };
}
