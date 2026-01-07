import { RegionConfig } from "./regions.config";

export type Language = "en" | "es" | "fr";

/**
 * Language resolution helpers.
 * Deterministic and safe.
 */

export function getDefaultLanguage(region: RegionConfig): Language {
  return region.defaultLanguage;
}

export function isLanguageAllowed(
  region: RegionConfig,
  lang: Language
): boolean {
  return region.allowedLanguages.includes(lang);
}

export function resolveLanguage(
  region: RegionConfig,
  requested: Language
): Language {
  return isLanguageAllowed(region, requested)
    ? requested
    : region.defaultLanguage;
}
