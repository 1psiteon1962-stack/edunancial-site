import { RegionConfig } from "./regions.config";

/**
 * Simple readiness check.
 * This is intentionally decoupled from env vars for safety.
 */
const READY_KEYS = new Set<string>([
  "us-live",
  "latam-live",
  "caribbean-live",
  "africa-live",
  "europe-live",
  "asia-live",
  // cuba intentionally excluded
]);

export function isRegionReady(region: RegionConfig): boolean {
  return READY_KEYS.has(region.readinessKey);
}

/**
 * Final gate used by pages, layouts, or middleware
 */
export function canAccessRegion(region: RegionConfig): boolean {
  return region.enabled && isRegionReady(region);
}
