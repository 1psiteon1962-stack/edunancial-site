import { RegionConfig } from "./regions.config";
import { isReady } from "./readinessGate";

/**
 * Determines whether a region can be navigated/rendered.
 * This is a HARD gate — used by routing and UI decisions.
 */
export function isRegionNavigable(
  region: RegionConfig
): boolean {
  return region.enabled && isReady(region.readinessKey);
}
