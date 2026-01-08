// lib/regionAccess.ts

import { REGIONS, RegionCode } from "./regions.config";
import { canAccessRegion } from "./navigationGuard";

/**
 * Returns region access metadata used by routing and UI.
 */
export function getRegionAccess(regionCode: RegionCode) {
  const region = REGIONS[regionCode];

  return {
    region,
    allowed: canAccessRegion(region),
    enabled: region.enabled,
    readinessKey: region.readinessKey,
  };
}
