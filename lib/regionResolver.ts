import { REGIONS, RegionCode } from "./regions.config";

/**
 * Resolve region from URL params.
 * Returns null if invalid.
 */

export function resolveRegion(
  input?: string
): RegionCode | null {
  if (!input) return null;
  return input in REGIONS ? (input as RegionCode) : null;
}
