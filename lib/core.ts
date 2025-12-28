// lib/core.ts

export type Region =
  | "US"
  | "EU"
  | "LATAM"
  | "APAC"
  | "MENA"
  | "AFRICA";

export type Language = "en" | "es" | "pt";

export const REGION_LANGUAGES: Record<Region, readonly Language[]> = {
  US: ["en", "es"],
  EU: ["en"],
  APAC: ["en"],
  MENA: ["en"],
  LATAM: ["es", "pt"],
  AFRICA: ["en", "pt"],
} as const;

export function resolveCopy(
  region: Region,
  language: Language
): string | null {
  const allowed = REGION_LANGUAGES[region];
  if (!allowed.includes(language)) return null;
  return `${region} content (${language})`;
}
