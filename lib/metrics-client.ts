// lib/metrics-client.ts
import { MetricEvent } from "./metrics-types";

export function trackEvent(
  event: MetricEvent,
  region: string,
  level?: number,
  amount?: number
) {
  fetch("/.netlify/functions/metrics-write", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": "INTERNAL_ONLY"
    },
    body: JSON.stringify({
      event,
      region,
      level,
      amount
    })
  }).catch(() => {});
}
