import type { KPIEvent } from "./types";

export async function trackKPI(event: KPIEvent) {
  try {
    await fetch("/api/kpi/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...event,
        timestamp: Date.now(),
      }),
    });
  } catch (err) {
    console.error("KPI tracking failed:", err);
  }
}
