// lib/regions.config.ts

export type RegionCode =
  | "us"
  | "africa"
  | "asia"
  | "asia-pacific"
  | "asia-emerging"
  | "mena"
  | "europe"
  | "caribbean";

export interface RegionConfig {
  name: string;
  enabled: boolean;
  defaultLanguage: "en" | "es" | "fr";
  languages: readonly ("en" | "es" | "fr")[];
  readinessKey: string;
}

export const REGIONS: Record<RegionCode, RegionConfig> = {
  us: {
    name: "United States",
    enabled: true,
    defaultLanguage: "en",
    languages: ["en", "es"],
    readinessKey: "us",
  },

  // Other regions intentionally disabled until activated
  africa: {
    name: "Africa",
    enabled: false,
    defaultLanguage: "en",
    languages: ["en", "fr"],
    readinessKey: "africa",
  },

  asia: {
    name: "Asia",
    enabled: false,
    defaultLanguage: "en",
    languages: ["en"],
    readinessKey: "asia",
  },

  "asia-pacific": {
    name: "Asia Pacific",
    enabled: false,
    defaultLanguage: "en",
    languages: ["en"],
    readinessKey: "asia-pacific",
  },

  "asia-emerging": {
    name: "Asia Emerging",
    enabled: false,
    defaultLanguage: "en",
    languages: ["en"],
    readinessKey: "asia-emerging",
  },

  mena: {
    name: "MENA",
    enabled: false,
    defaultLanguage: "en",
    languages: ["en", "fr"],
    readinessKey: "mena",
  },

  europe: {
    name: "Europe",
    enabled: false,
    defaultLanguage: "en",
    languages: ["en", "fr"],
    readinessKey: "europe",
  },

  caribbean: {
    name: "Caribbean",
    enabled: false,
    defaultLanguage: "en",
    languages: ["en", "es", "fr"],
    readinessKey: "caribbean",
  },
};
