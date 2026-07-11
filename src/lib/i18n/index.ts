/**
 * Region Language Packs
 *
 * Each region re-exports the standard i18n getDictionary loader and declares
 * which locales it supports. No translation strings are duplicated here —
 * all strings live in src/lib/i18n/translations/*.ts.
 *
 * Regions are referenced by their RegionCode and inherit the global engine.
 */

export { getDictionary } from "./getDictionary";
export { languages, supportedLanguages, isLanguage } from "./languages";
export type { SupportedLanguage, Language, SupportedLanguageConfig } from "./languages";

// ─── Region-specific locale subsets ─────────────────────────────────────────
// Each array is the ordered list of locales for that region.
// The first entry is the default.

export const EUROPE_LOCALES   = ["en", "de", "fr", "it", "es", "pt"] as const;
export const LATAM_LOCALES    = ["es", "en", "pt"] as const;
export const AFRICA_LOCALES   = ["en", "fr", "sw", "ar"] as const;
export const MENA_LOCALES     = ["ar", "en", "fr", "he", "tr"] as const;
export const ASIA_LOCALES     = ["en", "zh", "ja", "ko", "hi", "tl"] as const;
export const CARIBBEAN_LOCALES = ["en", "es", "fr"] as const;
export const OCEANIA_LOCALES  = ["en"] as const;
export const US_LOCALES       = ["en", "es"] as const;

export type EuropeLocale   = (typeof EUROPE_LOCALES)[number];
export type LatamLocale    = (typeof LATAM_LOCALES)[number];
export type AfricaLocale   = (typeof AFRICA_LOCALES)[number];
export type MenaLocale     = (typeof MENA_LOCALES)[number];
export type AsiaLocale     = (typeof ASIA_LOCALES)[number];
export type CaribbeanLocale = (typeof CARIBBEAN_LOCALES)[number];
export type OceaniaLocale  = (typeof OCEANIA_LOCALES)[number];
