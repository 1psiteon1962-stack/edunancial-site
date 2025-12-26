// lib/metrics.ts
import { Region } from "./core";

export type MetricEvent = {
  ts: string; // ISO timestamp
  region: Region;
  name:
    | "page_view"
    | "cta_click"
    | "lead_submit"
    | "membership_set"
    | "module_open"
    | "cashflow_submit";
  value?: number;
  meta?: Record<string, string>;
};

const KEY = "edunancial_metrics_events";

export function recordEvent(ev: Omit<MetricEvent, "ts">) {
  if (typeof window === "undefined") return;
  const existing = getEvents();
  existing.push({ ...ev, ts: new Date().toISOString() });
  localStorage.setItem(KEY, JSON.stringify(existing));
}

export function getEvents(): MetricEvent[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export function clearEvents() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
