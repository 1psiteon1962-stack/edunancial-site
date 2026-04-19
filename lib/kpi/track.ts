// lib/kpi/track.ts

type KPIEvent = {
  event: string;
  timestamp?: number;
  metadata?: Record<string, any>;
};

/**
 * trackKPI
 * Safe client-side KPI tracking
 * Does NOT break build if backend is unavailable
 */
export async function trackKPI(event: string, metadata?: Record<string, any>) {
  try {
    const payload: KPIEvent = {
      event,
      timestamp: Date.now(),
      metadata,
    };

    // ✅ SAFE: only runs in browser
    if (typeof window !== "undefined") {
      await fetch("/api/kpi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }
  } catch (error) {
    // ✅ NEVER break app
    console.warn("KPI tracking failed:", error);
  }
}
