export type Language = 'en' | 'es'

/**
 * Supported languages list
 */
export const languages: Language[] = ['en', 'es']

/**
 * Type guard to validate language param
 */
export function isLanguage(value: string): value is Language {
  return languages.includes(value as Language)
}

/**
 * Optional helper (safe default)
 */
export function normalizeLanguage(value: string | undefined): Language {
  if (!value) return 'en'
  return isLanguage(value) ? value : 'en'
}
