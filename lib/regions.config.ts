import { Language } from "./languageSelectors";

/**
 * Canonical region codes
 */
export type RegionCode =
  | "us"
  | "latam"
  | "caribbean"
  | "africa"
  | "europe"
  | "asia"
  | "cuba";

/**
 * Region configuration contract
 */
export interface RegionConfig {
  code: RegionCode;
  name: string;

  enabled: boolean;

  /** Feature gate / rollout switch */
  readinessKey: string;

  /** Language handling */
  defaultLanguage: Language;
  supportedLanguages: readonly Language[];
}

/**
 * Central region registry
 */
export const REGIONS: Record<RegionCode, RegionConfig> = {
  us: {
    code: "us",
    name: "United States",
    enabled: true,
    readinessKey: "us-live",
    defaultLanguage: "en",
    supportedLanguages: ["en", "es"],
  },

  latam: {
    code: "latam",
    name: "Latin America",
    enabled: true,
    readinessKey: "latam-live",
    defaultLanguage: "es",
    supportedLanguages: ["es", "pt", "en"],
  },

  caribbean: {
    code: "caribbean",
    name: "Caribbean",
    enabled: true,
    readinessKey: "caribbean-live",
    defaultLanguage: "es",
    supportedLanguages: ["es", "en", "fr", "nl"],
  },

  africa: {
    code: "africa",
    name: "Africa",
    enabled: true,
    readinessKey: "africa-live",
    defaultLanguage: "en",
    supportedLanguages: ["en", "fr", "ar"],
  },

  europe: {
    code: "europe",
    name: "Europe",
    enabled: true,
    readinessKey: "europe-live",
    defaultLanguage: "en",
    supportedLanguages: ["en", "fr", "de", "es"],
  },

  asia: {
    code: "asia",
    name: "Asia",
    enabled: true,
    readinessKey: "asia-live",
    defaultLanguage: "en",
    supportedLanguages: ["en"],
  },

  cuba: {
    code: "cuba",
    name: "Cuba",
    enabled: false, // intentionally dormant
    readinessKey: "cuba-locked",
    defaultLanguage: "es",
    supportedLanguages: ["es"],
  },
};
