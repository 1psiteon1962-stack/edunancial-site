export function trackMetric(
  name: string,
  payload?: Record<string, unknown>
) {
  if (process.env.NODE_ENV !== "production") {
    console.log("[metric]", name, payload);
  }
}
