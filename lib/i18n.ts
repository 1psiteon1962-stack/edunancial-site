export const REGION_LANGUAGES = ["en", "es", "fr", "ar"] as const

export type Language = (typeof REGION_LANGUAGES)[number]

export function isLanguage(x: any): x is Language {
  return REGION_LANGUAGES.includes(x)
}

export function t(key: string) {
  return key
}
