// lib/core.ts

/**
 * Supported regions
 * This is the authoritative Region list
 */
export type Region =
  | "US"
  | "EU"
  | "AFRICA"
  | "LATAM"
  | "MENA";

/**
 * Supported languages
 * THIS MUST INCLUDE *EVERY* [lang] ROUTE VALUE
 */
export type Language =
  | "en"
  | "es"
  | "pt"
  | "fr"
  | "ar";

/**
 * Default language fallback
 */
export const DEFAULT_LANGUAGE: Language = "en";

/**
 * Optional helper if needed elsewhere
 */
export function isLanguage(value: string): value is Language {
  return ["en", "es", "pt", "fr", "ar"].includes(value);
}
