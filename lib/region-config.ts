// lib/region-config.ts
// Centralized region expansion control

export type RegionSlug = "us" | "mena" | "latam" | "eu";

export const REGION_CONFIG: Record<
  RegionSlug,
  {
    defaultLanguage: string;
    supportedLanguages: string[];
    currency: string;
  }
> = {
  us: {
    defaultLanguage: "en",
    supportedLanguages: ["en", "es"],
    currency: "USD",
  },
  mena: {
    defaultLanguage: "ar",
    supportedLanguages: ["ar", "en"],
    currency: "USD",
  },
  latam: {
    defaultLanguage: "es",
    supportedLanguages: ["es", "en"],
    currency: "USD",
  },
  eu: {
    defaultLanguage: "en",
    supportedLanguages: ["en", "de", "fr"],
    currency: "EUR",
  },
};
