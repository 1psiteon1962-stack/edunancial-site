import type { RegionMeta } from "@/data/regions";

export function isRegionAccessible(region: RegionMeta): boolean {
  return region.enabled === true;
}
