/**
 * Competency Passport — Region Adapter
 *
 * Every EDUNANCIAL global region creates one instance of this adapter.
 * The adapter merges region-specific configuration with global defaults,
 * ensuring zero code duplication across regions.
 *
 * Usage:
 *   const naAdapter = new RegionPassportAdapter(NORTH_AMERICA_CONFIG);
 *   const passport = naAdapter.buildPassport(input);
 */

import { RegionPassportConfig } from "./types";

export const NORTH_AMERICA_CONFIG: RegionPassportConfig = {
  regionId: "north-america",
  regionName: "North America",
  aiCoachUnlockScore: 40,
  aiCoachRequiredLevel: "Foundation",
  certificateBaseUrl: "https://edunancial.com/certificates",
};

export const LATAM_CONFIG: RegionPassportConfig = {
  regionId: "latam",
  regionName: "Latin America",
  aiCoachUnlockScore: 40,
  aiCoachRequiredLevel: "Foundation",
  certificateBaseUrl: "https://edunancial.com/certificates",
};

export const CARIBBEAN_CONFIG: RegionPassportConfig = {
  regionId: "caribbean",
  regionName: "Caribbean",
  aiCoachUnlockScore: 40,
  aiCoachRequiredLevel: "Foundation",
  certificateBaseUrl: "https://edunancial.com/certificates",
};

export const AFRICA_CONFIG: RegionPassportConfig = {
  regionId: "africa",
  regionName: "Africa",
  aiCoachUnlockScore: 40,
  aiCoachRequiredLevel: "Foundation",
  certificateBaseUrl: "https://edunancial.com/certificates",
};

export const EUROPE_CONFIG: RegionPassportConfig = {
  regionId: "europe",
  regionName: "Europe",
  aiCoachUnlockScore: 40,
  aiCoachRequiredLevel: "Foundation",
  certificateBaseUrl: "https://edunancial.com/certificates",
};

export const MIDDLE_EAST_CONFIG: RegionPassportConfig = {
  regionId: "middle-east",
  regionName: "Middle East",
  aiCoachUnlockScore: 40,
  aiCoachRequiredLevel: "Foundation",
  certificateBaseUrl: "https://edunancial.com/certificates",
};

export const ASIA_CONFIG: RegionPassportConfig = {
  regionId: "asia",
  regionName: "Asia",
  aiCoachUnlockScore: 40,
  aiCoachRequiredLevel: "Foundation",
  certificateBaseUrl: "https://edunancial.com/certificates",
};

export const OCEANIA_CONFIG: RegionPassportConfig = {
  regionId: "oceania",
  regionName: "Oceania",
  aiCoachUnlockScore: 40,
  aiCoachRequiredLevel: "Foundation",
  certificateBaseUrl: "https://edunancial.com/certificates",
};

/**
 * Returns the region config for a given region ID.
 * Falls back to North America if the region is not found.
 */
export function getRegionPassportConfig(
  regionId: string
): RegionPassportConfig {
  const map: Record<string, RegionPassportConfig> = {
    "north-america": NORTH_AMERICA_CONFIG,
    latam: LATAM_CONFIG,
    caribbean: CARIBBEAN_CONFIG,
    africa: AFRICA_CONFIG,
    europe: EUROPE_CONFIG,
    "middle-east": MIDDLE_EAST_CONFIG,
    asia: ASIA_CONFIG,
    oceania: OCEANIA_CONFIG,
  };

  return map[regionId] ?? NORTH_AMERICA_CONFIG;
}
