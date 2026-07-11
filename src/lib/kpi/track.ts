"use client";

import type { KPIEvent } from "./types";

import {
  createProtectedJsonHeaders,
  hasBrowserConsent,
} from "@/lib/security/client";

export async function trackKPI(event: KPIEvent) {
  try {
    if (!hasBrowserConsent("analytics")) {
      return;
    }

    await fetch("/api/kpi/track", {
      method: "POST",
      credentials: "same-origin",
      headers: createProtectedJsonHeaders(),
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error("trackKPI error:", error);
  }
}
