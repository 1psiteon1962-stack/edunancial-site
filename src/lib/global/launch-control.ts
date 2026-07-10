/**
 * Global Launch Control Framework
 *
 * Shared across all regions: North America, Europe, LATAM, Caribbean,
 * Africa, Middle East, Asia-Pacific, Oceania.
 *
 * No region-specific logic lives here — only the universal status
 * taxonomy and enforcement utilities.
 */

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

/**
 * ACTIVE   — Region/country is fully public and indexed.
 * PRIVATE  — Exists in config but is NOT publicly accessible or indexed.
 *            This is the safe default for any new region.
 * BETA     — Accessible to authorized beta users only, not indexed.
 * DISABLED — Completely off; routing and SEO suppressed.
 */
export type LaunchStatus = "ACTIVE" | "PRIVATE" | "BETA" | "DISABLED";

export interface LaunchControlConfig {
  /** Top-level status for the region. */
  regionStatus: LaunchStatus;
  /**
   * Optional country-level overrides.
   * Key is ISO 3166-1 alpha-2 country code (lowercase).
   * If absent, the country inherits regionStatus.
   */
  countryOverrides?: Partial<Record<string, LaunchStatus>>;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Returns true only when status is ACTIVE — the region/country is fully public. */
export function isPublic(status: LaunchStatus): boolean {
  return status === "ACTIVE";
}

/** Returns true when the region/country is reachable (ACTIVE or BETA). */
export function isAccessible(status: LaunchStatus): boolean {
  return status === "ACTIVE" || status === "BETA";
}

/** Returns true when SEO indexing should be allowed. */
export function isIndexable(status: LaunchStatus): boolean {
  return status === "ACTIVE";
}

/**
 * Resolve the effective launch status for a specific country inside a region,
 * applying country-level overrides when present.
 */
export function resolveCountryStatus(
  countryCode: string,
  config: LaunchControlConfig
): LaunchStatus {
  const override = config.countryOverrides?.[countryCode.toLowerCase()];
  return override ?? config.regionStatus;
}

/**
 * Returns all country codes that have an ACTIVE status within a region config.
 */
export function getActiveCountries(
  countryCodes: string[],
  config: LaunchControlConfig
): string[] {
  return countryCodes.filter(
    (code) => resolveCountryStatus(code, config) === "ACTIVE"
  );
}

/**
 * Returns all country codes that are publicly indexable within a region config.
 */
export function getIndexableCountries(
  countryCodes: string[],
  config: LaunchControlConfig
): string[] {
  return countryCodes.filter((code) =>
    isIndexable(resolveCountryStatus(code, config))
  );
}
