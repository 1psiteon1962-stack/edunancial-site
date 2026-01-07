/**
 * Region registry.
 * Declarative only. No logic.
 */

export type RegionCode =
  | "us"
  | "caribbean"
  | "latam"
  | "africa"
  | "cuba";

export type RegionConfig = {
  code: RegionCode;
  name: string;
  enabled: boolean;
  defaultLanguage: "en" | "es" | "fr";
  allowedLanguages: Array<"en" | "es" | "fr">;
};

export const REGIONS: Record<RegionCode, RegionConfig> = {
  us: {
    code: "us",
    name: "United States",
    enabled: true,
    defaultLanguage: "en",
    allowedLanguages: ["en", "es"],
  },

  caribbean: {
    code: "caribbean",
    name: "Caribbean",
    enabled: true,
    defaultLanguage: "es",
    allowedLanguages: ["en", "es", "fr"],
  },

  latam: {
    code: "latam",
    name: "Latin America",
    enabled: true,
    defaultLanguage: "es",
    allowedLanguages: ["en", "es"],
  },

  africa: {
    code: "africa",
    name: "Africa",
    enabled: true,
    defaultLanguage: "en",
    allowedLanguages: ["en", "fr"],
  },

  cuba: {
    code: "cuba",
    name: "Cuba (Transition Pending)",
    enabled: false, // explicitly disabled
    defaultLanguage: "es",
    allowedLanguages: ["es"],
  },
};
