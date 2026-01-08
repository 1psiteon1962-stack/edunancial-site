// lib/languageSelectors.ts

/**
 * Supported language codes.
 * Keep this intentionally small and explicit.
 * Expand only when a region officially supports a language.
 */
export type Language = 'en' | 'es' | 'fr';

/**
 * Resolves a requested language against allowed languages for a region.
 */
export function resolveLanguage(
  requested: string | undefined,
  allowed: readonly Language[],
  fallback: Language
): Language {
  if (!requested) return fallback;

  return allowed.includes(requested as Language)
    ? (requested as Language)
    : fallback;
}
