export const translations = {
  en: {
    homeTitle: "Welcome to Edunancial",
    homeSubtitle: "Financial literacy starts here",
  },
  es: {
    homeTitle: "Bienvenido a Edunancial",
    homeSubtitle: "La educación financiera comienza aquí",
  },
} as const;

export type Language = keyof typeof translations;

export const DEFAULT_LANGUAGE: Language = "en";

export function isLanguage(value: string): value is Language {
  return value in translations;
}

export function t(
  key: keyof (typeof translations)[Language],
  lang: Language = DEFAULT_LANGUAGE
): string {
  return translations[lang][key];
}
