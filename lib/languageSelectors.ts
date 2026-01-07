import { RegionConfig } from "./regions.config";

/**
 * Supported language codes
 */
export type Language =
  | "en"
  | "es"
  | "pt"
  | "fr"
  | "de"
  | "nl"
  | "ar";

/**
 * Returns true if a language is allowed in the region
 */
export function isLanguageAllowed(
  region: RegionConfig,
  lang: Language
): boolean {
  return region.allowedLanguages.includes(lang);
}

/**
 * Resolves the best language for a region
 */
export function resolveLanguage(
  region: RegionConfig,
  requested: Language | undefined
): Language {
  if (requested && region.allowedLanguages.includes(requested)) {
    return requested;
  }
  return region.defaultLanguage;
}
