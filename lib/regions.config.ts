// lib/regions.config.ts

import type { RegionConfig } from "./regionConfig";

export const REGIONS = {
  us: {
    name: "United States",
    languages: ["en", "es"],
    defaultLanguage: "en",
    currency: "USD",
    timezone: "America/New_York",
  },

  africa: {
    name: "Africa",
    languages: ["en", "fr"],
    defaultLanguage: "en",
  },

  "asia-pacific": {
    name: "Asia Pacific",
    languages: ["en"],
    defaultLanguage: "en",
  },

  "asia-emerging": {
    name: "Asia Emerging",
    languages: ["en"],
    defaultLanguage: "en",
  },

  mena: {
    name: "Middle East & North Africa",
    languages: ["en", "fr"],
    defaultLanguage: "en",
  },

  caribbean: {
    name: "Caribbean",
    languages: ["en", "es", "fr"],
    defaultLanguage: "en",
  },
} satisfies Record<string, RegionConfig>;

/**
 * Canonical region code type
 */
export type RegionCode = keyof typeof REGIONS;
