import type { KPIEvent } from "./types";

export async function trackKPI(event: KPIEvent) {
  try {
    await fetch("/api/kpi/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error("trackKPI error:", error);
  }
}
