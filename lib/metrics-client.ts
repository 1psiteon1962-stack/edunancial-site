export function trackMetric(event: string, data?: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    console.log(event, data);
  }
}
