// src/lib/i18n.ts

export const supportedLanguages = [
  "en", // English
  "es", // Spanish
  "fr", // French
  "pt", // Portuguese
  "ar", // Arabic
  "ja", // Japanese
  "ko", // Korean
  "de", // German
  "it", // Italian
] as const;

export type Language = typeof supportedLanguages[number];

export const isLanguage = (value: string): value is Language => {
  return (supportedLanguages as readonly string[]).includes(value);
};

/**
 * Central translation table.
 * Every Language MUST be represented here.
 */
const translations: Record<Language, Record<string, string>> = {
  en: {
    doctrine_title: "Doctrine",
    doctrine_body: "Foundational principles and structure.",
  },
  es: {
    doctrine_title: "Doctrina",
    doctrine_body: "Principios y estructura fundamentales.",
  },
  fr: {
    doctrine_title: "Doctrine",
    doctrine_body: "Principes fondamentaux et structure.",
  },
  pt: {
    doctrine_title: "Doutrina",
    doctrine_body: "Princípios e estrutura fundamentais.",
  },
  ar: {
    doctrine_title: "العقيدة",
    doctrine_body: "المبادئ والبنية الأساسية.",
  },
  ja: {
    doctrine_title: "教義",
    doctrine_body: "基本原則と構造。",
  },
  ko: {
    doctrine_title: "교리",
    doctrine_body: "기본 원칙과 구조.",
  },
  de: {
    doctrine_title: "Doktrin",
    doctrine_body: "Grundlegende Prinzipien und Struktur.",
  },
  it: {
    doctrine_title: "Dottrina",
    doctrine_body: "Principi fondamentali e struttura.",
  },
};

export function t(lang: Language, key: string): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}
