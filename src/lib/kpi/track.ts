export type KPIEventName =
  | "page_view"
  | "signup_started"
  | "signup_completed"
  | "purchase_started"
  | "purchase_completed";

export async function trackKPI(eventName: KPIEventName) {
  try {
    await fetch("/api/kpi/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: eventName,
      }),
    });
  } catch (error) {
    // Silent fail for client tracking
    console.error("KPI tracking error:", error);
  }
}
