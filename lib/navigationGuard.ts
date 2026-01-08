// lib/navigationGuard.ts

import { RegionConfig } from "./regions.config";

/**
 * Determines whether a region is accessible.
 * This is the SINGLE source of truth for region gating logic.
 *
 * Future use:
 * - Compliance restrictions
 * - Regulatory holds
 * - Feature rollouts
 * - Sanctions / geo blocks
 */
export function canAccessRegion(region: RegionConfig): boolean {
  if (!region.enabled) return false;

  // Placeholder for future rules:
  // - regulatory approval
  // - payment rails available
  // - language readiness
  // - operational staffing

  return true;
}
