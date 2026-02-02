// lib/i18n.ts

export const supportedLanguages = [
  "en",
  "es",
  "fr",
  "ar",
  "pt",
] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

/**
 * Type guard: confirms a string is a supported language code.
 */
export function isLanguage(value: string): value is SupportedLanguage {
  return supportedLanguages.includes(value as SupportedLanguage);
}

/**
 * Normalize unknown language input into a safe default.
 */
export function normalizeLanguage(value: string | undefined | null): SupportedLanguage {
  if (!value) return "en";
  return isLanguage(value) ? value : "en";
}
