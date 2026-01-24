export const DEFAULT_LANGUAGE = "en" as const;

export const REGION_LANGUAGES = {
  us: ["en", "es"],

  europe: ["en", "fr", "es", "pt", "it", "nl", "de", "pl"],

  latam: ["es", "en", "pt"],

  mena: ["en", "ar"],

  africa: ["en", "fr", "pt"],

  caribbean: ["en", "es", "fr", "nl"],

  asia: ["en", "ja", "ko"],
} as const;

export type RegionCode = keyof typeof REGION_LANGUAGES;
export type Language = (typeof REGION_LANGUAGES)[RegionCode][number];

export const SUPPORTED_LANGUAGES = Array.from(
  new Set(Object.values(REGION_LANGUAGES).flat())
) as Language[];

export function isLanguage(value: string): value is Language {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

type Dictionary = Record<string, string>;

const DICTS: Record<Language, Dictionary> = {
  en: {},
  es: {},
  fr: {},
  pt: {},
  it: {},
  nl: {},
  de: {},
  pl: {},
  ar: {},
  ja: {},
  ko: {},
};

export function t(key: string, lang: Language = DEFAULT_LANGUAGE): string {
  const dict = DICTS[lang] ?? DICTS[DEFAULT_LANGUAGE];
  return dict?.[key] ?? key;
}
