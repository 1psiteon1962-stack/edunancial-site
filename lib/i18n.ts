// lib/i18n.ts

export const SUPPORTED_LANGS = ["en", "es", "fr", "de", "ar"] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

export const DEFAULT_LANG: SupportedLang = "en";

export function isSupportedLang(value: string): value is SupportedLang {
  return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

export function t(key: string, lang: SupportedLang): string {
  const dict: Record<string, Record<string, string>> = {
    missionTitle: {
      en: "Financial Literacy for Real Life",
      es: "Educación financiera para la vida real"
    },
    missionBody: {
      en: "Understand money, risk, and growth—clearly and practically.",
      es: "Entiende el dinero, el riesgo y el crecimiento—de forma clara."
    }
  };

  return dict[key]?.[lang] ?? dict[key]?.[DEFAULT_LANG] ?? key;
}
