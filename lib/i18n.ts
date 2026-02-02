// lib/i18n.ts

export type Locale = "en" | "es";

const DICTIONARY: Record<Locale, Record<string, string>> = {
  en: {
    doctrine_title: "Doctrine",
    doctrine_body: "This is the English doctrine text.",
  },
  es: {
    doctrine_title: "Doctrina",
    doctrine_body: "Este es el texto doctrinal en español.",
  },
};

/**
 * Translation helper
 * Usage: t("doctrine_title", "en")
 */
export function t(key: string, locale: string): string {
  const lang = (locale as Locale) || "en";
  return DICTIONARY[lang]?.[key] ?? key;
}
