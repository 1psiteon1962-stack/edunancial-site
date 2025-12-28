// lib/core.ts

/**
 * Authoritative language list
 * MUST include every locale exposed by routes
 */
export type Language =
  | "en" // English
  | "es" // Spanish
  | "pt" // Portuguese
  | "fr" // French
  | "ar"; // Arabic

/**
 * Default language fallback
 */
export const DEFAULT_LANGUAGE: Language = "en";

/**
 * Supported regions
 */
export type Region =
  | "US"
  | "EU"
  | "AFRICA"
  | "LATAM"
  | "MENA";

/**
 * Runtime region resolver
 */
export function resolveRegion(input: string): Region {
  switch (input.toUpperCase()) {
    case "US":
    case "EU":
    case "AFRICA":
    case "LATAM":
    case "MENA":
      return input.toUpperCase() as Region;
    default:
      throw new Error(`Unknown region: ${input}`);
  }
}
