// lib/regions.config.ts

export type RegionCode =
  | "us"
  | "latam"
  | "africa"
  | "asia"
  | "asia-pacific"
  | "asia-emerging"
  | "mena"
  | "middle-east"
  | "europe"
  | "europe-2a"
  | "europe-2b"
  | "latin-america"
  | "latin-america-segment-a"
  | "latin-america-segment-b"
  | "caribbean";

export interface RegionConfig {
  name: string;
  enabled: boolean;
  defaultLanguage: "en" | "es" | "fr" | "pt" | "nl";
  languages: readonly ("en" | "es" | "fr" | "pt" | "nl")[];
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

  // LATAM: PRIVATE by default — enabled=false until formally activated
  latam: {
    name: "Latin America",
    enabled: false,
    defaultLanguage: "es",
    languages: ["es", "pt", "en", "fr", "nl"],
    readinessKey: "latam",
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

  "europe-2a": {
    name: "Europe 2A — Western Europe",
    enabled: false,
    defaultLanguage: "en",
    languages: ["en", "fr"],
    readinessKey: "europe-2a",
  },

  "europe-2b": {
    name: "Europe 2B — Central & Eastern Europe",
    enabled: false,
    defaultLanguage: "en",
    languages: ["en", "fr"],
    readinessKey: "europe-2b",
  },

  "latin-america": {
    name: "Latin America",
    enabled: false,
    defaultLanguage: "es",
    languages: ["es", "en", "fr"],
    readinessKey: "latin-america",
  },

  "latin-america-segment-a": {
    name: "Latin America — Segment A (Mexico & Central America)",
    enabled: false,
    defaultLanguage: "es",
    languages: ["es", "en"],
    readinessKey: "latin-america-segment-a",
  },

  "latin-america-segment-b": {
    name: "Latin America — Segment B (South America)",
    enabled: false,
    defaultLanguage: "es",
    languages: ["es", "en", "fr"],
    readinessKey: "latin-america-segment-b",
  },

  caribbean: {
    name: "Caribbean",
    enabled: false,
    defaultLanguage: "en",
    languages: ["en", "es", "fr"],
    readinessKey: "caribbean",
  },

  "middle-east": {
    name: "Middle East",
    enabled: false,
    defaultLanguage: "en",
    languages: ["en", "fr"],
    readinessKey: "middle-east",
  },
};
