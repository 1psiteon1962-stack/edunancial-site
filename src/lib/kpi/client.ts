// src/lib/kpi/client.ts

export type KPIEventPayload = {
  event: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
};

export async function trackKPI(payload: KPIEventPayload): Promise<void> {
  try {
    if (typeof window === "undefined") {
      return;
    }

    await fetch("/api/kpi/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.warn("KPI tracking failed:", error);
  }
}
