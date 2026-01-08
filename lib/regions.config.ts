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

  // other regions remain unchanged
};
