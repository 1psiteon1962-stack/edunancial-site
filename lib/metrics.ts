export function trackEvent(event: string, data?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") {
    console.log("[metrics]", event, data);
  }
}
