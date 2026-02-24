export type KPIEventName =
  | "page_view"
  | "cta_click"
  | "purchase_start"
  | "purchase_complete"
  | "lead_submit";

export interface KPIClientPayload {
  event_name: KPIEventName;
  path?: string;
  referrer?: string;
  metadata?: Record<string, any>;
}

export async function trackKPI(
  eventName: KPIEventName,
  payload?: Omit<KPIClientPayload, "event_name">
) {
  try {
    const safeWindow =
      typeof window !== "undefined" ? window : undefined;

    const safeDocument =
      typeof document !== "undefined" ? document : undefined;

    const finalPayload: KPIClientPayload = {
      event_name: eventName,
      path:
        payload?.path ??
        (safeWindow ? safeWindow.location.pathname : ""),
      referrer:
        payload?.referrer ??
        (safeDocument ? safeDocument.referrer : ""),
      metadata: {
        ...(payload?.metadata ?? {})
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
    console.error("KPI client error:", err);
  }
}
