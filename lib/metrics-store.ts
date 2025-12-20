// lib/metrics-store.ts
// In-memory metrics buffer (safe placeholder)

import {
  KPIEvent,
  TrafficMetric,
  AppUsageMetric,
} from "./metrics-types";

// TEMP storage (replaced later by DB, Sheets, or Data Warehouse)
const kpiEvents: KPIEvent[] = [];
const trafficMetrics: TrafficMetric[] = [];
const appUsageMetrics: AppUsageMetric[] = [];

// KPI EVENTS
export function recordKPI(event: KPIEvent) {
  kpiEvents.push(event);
}

// TRAFFIC
export function recordTraffic(metric: TrafficMetric) {
  trafficMetrics.push(metric);
}

// APP USAGE
export function recordAppUsage(metric: AppUsageMetric) {
  appUsageMetrics.push(metric);
}

// INTERNAL READ (ADMIN ONLY)
export function readMetrics() {
  return {
    kpiEvents,
    trafficMetrics,
    appUsageMetrics,
  };
}
