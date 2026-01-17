// lib/i18n.ts

export type Region = "us" | "mena";

export const REGION_LANGUAGES = {
  us: ["en", "es"] as const,
  mena: ["en", "ar"] as const,
} as const;

export type Language =
  (typeof REGION_LANGUAGES)[keyof typeof REGION_LANGUAGES][number];

export const DEFAULT_LANGUAGE_BY_REGION: Record<Region, Language> = {
  us: "en",
  mena: "en",
};

export const DEFAULT_LANGUAGE: Language = "en";

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    "us.title": "Edunancial — Financial Literacy",
    "us.subtitle":
      "Build wealth through Real Estate, Paper Assets, and Business Ownership.",
    "toggle.label": "Language",
    "toggle.en": "English",
    "toggle.es": "Español",
    "toggle.ar": "العربية",
  },
  es: {
    "us.title": "Edunancial — Financial Literacy",
    "us.subtitle":
      "Construye riqueza a través de Bienes Raíces, Activos de Papel y Negocios.",
    "toggle.label": "Idioma",
    "toggle.en": "English",
    "toggle.es": "Español",
    "toggle.ar": "العربية",
  },
  ar: {
    "us.title": "Edunancial — Financial Literacy",
    "us.subtitle":
      "ابنِ الثروة عبر العقارات والأصول الورقية وملكية الأعمال.",
    "toggle.label": "اللغة",
    "toggle.en": "English",
    "toggle.es": "Español",
    "toggle.ar": "العربية",
  },
};

export const SUPPORTED_LANGUAGES = ["en", "es", "ar"] as const;

export function isLanguage(value: string): value is Language {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

export function t(key: string, language: Language = DEFAULT_LANGUAGE): string {
  return TRANSLATIONS[language]?.[key] ?? TRANSLATIONS.en?.[key] ?? key;
}
```0
