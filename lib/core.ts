// lib/core.ts

/**
 * Canonical Regions
 */
export type Region = "US" | "LATAM" | "EU" | "AFRICA" | "ASIA";

/**
 * Canonical Languages
 */
export type Language = "en" | "es" | "pt" | "fr";

/**
 * Default language for all content resolution
 * (Single source of truth)
 */
export const DEFAULT_LANGUAGE: Language = "en";

/**
 * Region → allowed languages
 */
export const regionLanguages: Record<Region, readonly Language[]> = {
  US: ["en", "es"],
  LATAM: ["es", "pt"],
  EU: ["en", "fr"],
  AFRICA: ["en", "fr"],
  ASIA: ["en"],
};

/**
 * Content resolution helper
 */
export function resolveCopy(
  region: Region,
  language: Language
): string | null {
  if (!regionLanguages[region].includes(language)) {
    return null;
  }
  return `${region}-${language}`;
}
