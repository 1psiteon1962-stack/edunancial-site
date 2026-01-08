// data/regions.ts

export interface RegionMeta {
  name: string;
  description: string;
  languages: readonly string[];
  enabled: boolean;
}

export const REGIONS: Record<string, RegionMeta> = {
  us: {
    name: "United States",
    description: "Entrepreneurship, finance, and business systems for the U.S. market.",
    languages: ["en", "es"],
    enabled: true,
  },

  mena: {
    name: "Middle East & North Africa",
    description: "Business education adapted for MENA regulatory and cultural systems.",
    languages: ["ar", "en", "fr"],
    enabled: false,
  },

  europe: {
    name: "Europe",
    description: "Entrepreneurship within EU and European regulatory frameworks.",
    languages: ["en", "fr", "de", "es"],
    enabled: false,
  },

  asia_pacific: {
    name: "Asia Pacific",
    description: "Advanced and developed Asia-Pacific economies (Japan, Korea, Australia).",
    languages: ["en", "ja", "ko"],
    enabled: false,
  },

  asia_emerging: {
    name: "Asia Emerging",
    description: "Rapid-growth markets (India, SE Asia, frontier fintech ecosystems).",
    languages: ["en", "hi", "id", "vi"],
    enabled: false,
  },

  caribbean: {
    name: "Caribbean",
    description: "Caribbean-specific entrepreneurship and cross-border structures.",
    languages: ["en", "es", "fr", "nl"],
    enabled: false,
  },
};
