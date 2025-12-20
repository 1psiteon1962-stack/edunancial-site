// lib/metrics-store.ts
import { MetricRecord } from "./metrics-types";

const metrics: MetricRecord[] = [];

export function recordMetric(entry: MetricRecord) {
  metrics.push(entry);
}

export function getAllMetrics(): MetricRecord[] {
  return metrics;
}

export function summarizeMetrics() {
  const summary = {
    totalEvents: metrics.length,
    revenue: 0,
    byRegion: {} as Record<string, number>,
    byEvent: {} as Record<string, number>
  };

  for (const m of metrics) {
    summary.byRegion[m.region] =
      (summary.byRegion[m.region] || 0) + 1;

    summary.byEvent[m.event] =
      (summary.byEvent[m.event] || 0) + 1;

    if (m.amount) {
      summary.revenue += m.amount;
    }
  }

  return summary;
}
