export interface KPIClientPayload {
  event_name: string;
  path?: string;
  referrer?: string;
  metadata?: Record<string, any>;
}

export async function sendKPI(payload: KPIClientPayload) {
  try {
    const safeWindow =
      typeof window !== "undefined" ? window : undefined;

    const safeDocument =
      typeof document !== "undefined" ? document : undefined;

    const finalPayload = {
      event_name: payload.event_name,
      path:
        payload.path ??
        (safeWindow ? safeWindow.location.pathname : ""),
      referrer:
        payload.referrer ??
        (safeDocument ? safeDocument.referrer : ""),
      metadata: {
        ...(payload.metadata ?? {})
      }
    };

    await fetch("/api/kpi/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(finalPayload)
    });
  } catch (err) {
    // Silent fail for analytics
    console.error("KPI client error:", err);
  }
}
