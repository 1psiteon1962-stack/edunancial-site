/**
 * API analytics hooks.
 * Records request metrics: volume, response time, error rates, endpoint health.
 * Structured for ingestion by any time-series or analytics backend.
 */

import { logger } from "./logger";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RequestMetric {
  requestId: string;
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  userId?: string;
  apiVersion?: string;
  rateLimited?: boolean;
  timestamp: string;
  tags?: Record<string, string>;
}

export interface MetricsSink {
  record(metric: RequestMetric): void | Promise<void>;
}

// ─── Aggregates (in-process, useful for health endpoint) ──────────────────────

interface EndpointStats {
  requests: number;
  errors: number;
  totalDurationMs: number;
  rateLimitHits: number;
  lastSeen: string;
}

const endpointStats = new Map<string, EndpointStats>();

function updateStats(metric: RequestMetric): void {
  const key = `${metric.method}:${metric.path}`;
  const existing = endpointStats.get(key) ?? {
    requests: 0,
    errors: 0,
    totalDurationMs: 0,
    rateLimitHits: 0,
    lastSeen: metric.timestamp,
  };

  endpointStats.set(key, {
    requests: existing.requests + 1,
    errors: metric.statusCode >= 400 ? existing.errors + 1 : existing.errors,
    totalDurationMs: existing.totalDurationMs + metric.durationMs,
    rateLimitHits: metric.rateLimited ? existing.rateLimitHits + 1 : existing.rateLimitHits,
    lastSeen: metric.timestamp,
  });
}

export function getEndpointStats(): Record<string, EndpointStats & { avgDurationMs: number; errorRate: number }> {
  const result: Record<string, EndpointStats & { avgDurationMs: number; errorRate: number }> = {};
  for (const [key, stats] of endpointStats.entries()) {
    result[key] = {
      ...stats,
      avgDurationMs: stats.requests > 0 ? stats.totalDurationMs / stats.requests : 0,
      errorRate: stats.requests > 0 ? stats.errors / stats.requests : 0,
    };
  }
  return result;
}

// ─── Active sink ──────────────────────────────────────────────────────────────

const sinks: MetricsSink[] = [];

export function addMetricsSink(sink: MetricsSink): void {
  sinks.push(sink);
}

// ─── Record a request ─────────────────────────────────────────────────────────

export function recordRequest(metric: RequestMetric): void {
  updateStats(metric);
  logger.info("api.request", {
    requestId: metric.requestId,
    method: metric.method,
    path: metric.path,
    statusCode: metric.statusCode,
    durationMs: metric.durationMs,
    userId: metric.userId,
    apiVersion: metric.apiVersion,
    rateLimited: metric.rateLimited,
    ...metric.tags,
  });

  for (const sink of sinks) {
    void Promise.resolve(sink.record(metric)).catch((err) => {
      logger.warn("metrics.sink.error", { error: String(err) });
    });
  }
}

// ─── Timing helper ────────────────────────────────────────────────────────────

export function startTimer(): () => number {
  const start = Date.now();
  return () => Date.now() - start;
}

// ─── Request ID generation ────────────────────────────────────────────────────

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
