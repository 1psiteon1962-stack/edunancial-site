// lib/languageSelectors.ts

/**
 * Supported language codes.
 * Keep this intentionally small and explicit.
 * Expand only when a region officially supports a language.
 */
export type Language = string;
export type SupportedLanguage = Language;

/**
 * Resolves a requested language against allowed languages for a region.
 */
export function resolveLanguage(
  requested: string | undefined,
  allowed: readonly SupportedLanguage[],
  fallback: SupportedLanguage
): SupportedLanguage {
  if (!requested) return fallback;

  return allowed.includes(requested as SupportedLanguage)
    ? (requested as SupportedLanguage)
    : fallback;
}
