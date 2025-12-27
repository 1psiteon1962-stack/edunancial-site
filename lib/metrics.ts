// lib/metrics.ts

export type Region = "US" | "EU" | "AFRICA" | "LATAM";

export type MetricEventName = "page_view" | "cta_click";

export type MetricEvent = {
  region: Region;
  name: MetricEventName;
  timestamp?: number;
};

// TEMP: in-memory placeholder store
let events: MetricEvent[] = [];

export function getEvents(): MetricEvent[] {
  return events;
}

export function recordEvent(event: MetricEvent) {
  events.push({ ...event, timestamp: Date.now() });
}

export function clearEvents() {
  events = [];
}
