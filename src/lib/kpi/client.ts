"use client";

import type { KPIEvent, KPIEventName } from "./types";

function safeUrl(): string {
  try {
    return window.location.href;
  } catch {
    return "";
  }
}

function safeReferrer(): string {
  try {
    return document.referrer || "";
  } catch {
    return "";
  }
}

export async function trackKPI(event_name: KPIEventName, payload?: Omit<KPIEvent, "event_name">) {
  const body: KPIEvent = {
    event_name,
    path: payload?.path ?? (typeof window !== "undefined" ? window.location.pathname : null),
    referrer: payload?.referrer ?? safeReferrer() || null,
    ...payload,
    metadata: {
      ...(payload?.metadata ?? {}),
      url: safeUrl(),
      ts: new Date().toISOString(),
    },
  };

  // Fire-and-forget; don’t block UI
  void fetch("/api/kpi", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});
}
