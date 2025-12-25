// lib/language.ts

/**
 * Supported platform languages.
 * This is intentionally explicit to enforce correctness
 * across regions, mirrors, and content resolution.
 */
export type Language =
  | "en" // English
  | "es" // Spanish (LATAM, Caribbean)
  | "fr" // French (Africa)
  | "ar"; // Arabic (Africa, MENA)

/**
 * Default language per regional mirror.
 * Used for initial routing, SEO defaults, and content resolution.
 */
export const DEFAULT_LANGUAGE_BY_REGION: Record<
  "US" | "LATAM" | "AFRICA",
  Language
> = {
  US: "en",
  LATAM: "es",
  AFRICA: "en",
};

/**
 * Optional helper for validation or future expansion
 */
export const SUPPORTED_LANGUAGES: readonly Language[] = [
  "en",
  "es",
  "fr",
  "ar",
] as const;
