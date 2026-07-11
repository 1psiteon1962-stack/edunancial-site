// ======================================================
// AFRICA REGIONAL FOUNDATION
// founder.ts – Founder controls for Africa region
// ======================================================

import {
  AFRICA_FEATURE_FLAGS,
  AFRICA_REGION_ENABLED,
  AfricaFeatureFlags,
} from "./config";

export interface AfricaFounderControl {
  /** Globally enable / disable the Africa region (master switch). */
  regionEnabled: boolean;
  /** Granular feature-flag overrides set by the founder. */
  featureFlags: Partial<AfricaFeatureFlags>;
  /** ISO codes of countries approved for beta activation. */
  betaCountries: string[];
  /** ISO codes of countries approved for full launch. */
  liveCountries: string[];
  /** Maximum number of beta seats per country before waitlist gates. */
  betaSeatLimit: number;
  /** Founder-set launch date (ISO 8601), null = TBD. */
  plannedLaunchDate: string | null;
}

/**
 * Read-only snapshot of the current founder controls.
 * All values default to the most restrictive setting.
 * Modify AFRICA_REGION_ENABLED and AFRICA_FEATURE_FLAGS in config.ts
 * to control rollout.
 */
export const AFRICA_FOUNDER_CONTROLS: AfricaFounderControl = {
  regionEnabled: AFRICA_REGION_ENABLED,
  featureFlags: { ...AFRICA_FEATURE_FLAGS },
  betaCountries: [],
  liveCountries: [],
  betaSeatLimit: 100,
  plannedLaunchDate: null,
};

/** Returns true when the founder has approved a country for beta access. */
export function isCountryInBeta(countryIso: string): boolean {
  if (!AFRICA_FOUNDER_CONTROLS.regionEnabled) return false;
  return AFRICA_FOUNDER_CONTROLS.betaCountries.includes(
    countryIso.toUpperCase()
  );
}

/** Returns true when a country has been approved for full public launch. */
export function isCountryLive(countryIso: string): boolean {
  if (!AFRICA_FOUNDER_CONTROLS.regionEnabled) return false;
  return AFRICA_FOUNDER_CONTROLS.liveCountries.includes(
    countryIso.toUpperCase()
  );
}
