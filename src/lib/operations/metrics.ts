import { HealthStatus, MetricSample, MetricsProviderResult } from "@/lib/operations/types";

function severityRank(status: HealthStatus) {
  if (status === "critical") {
    return 3;
  }

  if (status === "warning") {
    return 2;
  }

  return 1;
}

export function aggregateOperationalMetrics(results: MetricsProviderResult[]) {
  const aggregated = new Map<string, MetricSample & { count: number }>();

  results.forEach((result) => {
    result.metrics.forEach((metric) => {
      const existing = aggregated.get(metric.id);

      if (!existing) {
        aggregated.set(metric.id, { ...metric, count: 1 });
        return;
      }

      const nextStatus = severityRank(metric.status) > severityRank(existing.status)
        ? metric.status
        : existing.status;

      aggregated.set(metric.id, {
        ...existing,
        value: existing.value + metric.value,
        count: existing.count + 1,
        status: nextStatus,
        trend: metric.trend,
      });
    });
  });

  return Array.from(aggregated.values()).map(({ count, value, ...metric }) => ({
    ...metric,
    value: Number((value / count).toFixed(2)),
  }));
}

export function formatMetricValue(metric: MetricSample) {
  switch (metric.unit) {
    case "percent":
      return `${metric.value.toFixed(1)}%`;
    case "ms":
      return `${metric.value.toFixed(0)} ms`;
    case "seconds":
      return `${metric.value.toFixed(0)} s`;
    case "gb":
      return `${metric.value.toFixed(1)} GB`;
    case "mbps":
      return `${metric.value.toFixed(0)} Mbps`;
    default:
      return `${metric.value.toLocaleString()}`;
  }
}
