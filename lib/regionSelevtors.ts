import { REGIONS, RegionCode, RegionConfig } from "./regions.config";

/**
 * Pure selectors.
 * No mutation. No side effects.
 */

export function getAllRegions(): RegionConfig[] {
  return Object.values(REGIONS);
}

export function getEnabledRegions(): RegionConfig[] {
  return Object.values(REGIONS).filter(r => r.enabled);
}

export function getRegion(code: RegionCode): RegionConfig | null {
  return REGIONS[code] ?? null;
}
