// lib/metrics-client.ts
// Safe client-side metric helpers (no secrets)

import {
  KPIEvent,
  TrafficMetric,
  AppUsageMetric,
} from "./metrics-types";

export function logKPI(event: KPIEvent) {
  console.info("[KPI EVENT]", event);
}

export function logTraffic(metric: TrafficMetric) {
  console.info("[TRAFFIC]", metric);
}

export function logAppUsage(metric: AppUsageMetric) {
  console.info("[APP USAGE]", metric);
}
