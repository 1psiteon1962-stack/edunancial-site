import { RegionConfig } from "./regions.config";
import { isReady } from "./readinessGate";

/**
 * Navigation gatekeeper.
 */

export function isRegionNavigable(
  region: RegionConfig
): boolean {
  return region.enabled && isReady(region.readinessKey);
}
