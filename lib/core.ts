// lib/core.ts

export type Region = "US" | "EU" | "LATAM" | "APAC" | "MENA";

/**
 * Global language union.
 * MUST include every language that appears in routes or fallbacks.
 */
export type Language = "en" | "es" | "pt";

/**
 * Region → allowed languages
 */
export const REGION_LANGUAGES: Record<Region, readonly Language[]> = {
  US: ["en", "es"],
  EU: ["en"],
  APAC: ["en"],
  MENA: ["en"],
  LATAM: ["es", "pt"],
} as const;

/**
 * Content resolver
 * (stub-safe – replace body later with real content logic)
 */
export function resolveCopy(
  region: Region,
  language: Language
): string | null {
  const allowed = REGION_LANGUAGES[region];

  if (!allowed.includes(language)) {
    return null;
  }

  // TEMP SAFE RETURN (prevents build failure)
  return `${region} content (${language})`;
}
