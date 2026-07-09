"use client";

export type KPIEventPayload = {
  event: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
};

import {
  createProtectedJsonHeaders,
  hasBrowserConsent,
} from "@/lib/security/client";

export async function trackKPI(payload: KPIEventPayload): Promise<void> {
  try {
    if (typeof window === "undefined") return;
    if (!hasBrowserConsent("analytics")) return;

    await fetch("/api/kpi/track", {
      method: "POST",
      credentials: "same-origin",
      headers: createProtectedJsonHeaders(),
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.warn("KPI tracking failed:", error);
  }
}
