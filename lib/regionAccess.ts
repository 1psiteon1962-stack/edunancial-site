import { REGIONS, RegionCode } from "./regions.config";
import { canAccessRegion } from "./navigationGuard";

export function getRegionAccess(regionCode: RegionCode) {
  const region = REGIONS[regionCode];

  return {
    region,
    allowed: canAccessRegion(region),
    enabled: region.enabled,
    readinessKey: region.readinessKey,
  };
}
