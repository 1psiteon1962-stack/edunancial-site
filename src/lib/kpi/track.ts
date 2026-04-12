export interface KPITrackPayload {
  event: string;
  data?: Record<string, unknown>;
}

export async function trackKPI(payload: KPITrackPayload): Promise<void> {
  try {
    await fetch("/api/kpi/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    // silent fail (do not break UI)
    console.error("trackKPI error:", error);
  }
}
