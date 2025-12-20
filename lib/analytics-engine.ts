// lib/analytics-engine.ts
// Block 18 — Growth & Investor Analytics Hooks
// No UI, no network calls, Netlify-safe

import { Level } from "./levels";
import { Persona } from "./activation-engine";

export type AnalyticsEvent =
  | "LEVEL_ENTERED"
  | "LEVEL_COMPLETED"
  | "ACTIVATION_GRANTED"
  | "ACTIVATION_DENIED"
  | "UPGRADE_AVAILABLE"
  | "UPGRADE_ATTEMPTED";

export interface AnalyticsPayload {
  userId?: string;
  level: Level;
  persona: Persona;
  region: string;
  readinessScore?: number;
  timestamp?: number;
  metadata?: Record<string, any>;
}

export interface AnalyticsRecord {
  event: AnalyticsEvent;
  payload: AnalyticsPayload;
}

const analyticsBuffer: AnalyticsRecord[] = [];

/**
 * Record an analytics event
 * Stored locally for now (future pipeline-ready)
 */
export function recordAnalyticsEvent(
  event: AnalyticsEvent,
  payload: AnalyticsPayload
): void {
  analyticsBuffer.push({
    event,
    payload: {
      ...payload,
      timestamp: Date.now(),
    },
  });
}

/**
 * Retrieve analytics buffer
 * Used later for dashboards / exports
 */
export function getAnalyticsBuffer(): AnalyticsRecord[] {
  return [...analyticsBuffer];
}

/**
 * Clear analytics buffer
 * Useful for testing or batch flush later
 */
export function clearAnalyticsBuffer(): void {
  analyticsBuffer.length = 0;
}
