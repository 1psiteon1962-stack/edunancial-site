type MetricPayload = Record<string, unknown>;

export function trackMetric(event: string, payload: MetricPayload) {
  if (process.env.NODE_ENV !== "production") {
    console.log("[metric]", event, payload);
    return;
  }

  // Placeholder for real analytics endpoint
}
