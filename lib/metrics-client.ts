type MetricPayload = Record<string, unknown>;

export function trackMetric(event: string, payload: MetricPayload = {}) {
  // Safe no-op for now (won't break build). Later: wire to analytics.
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[metric]", event, payload);
  }
}
