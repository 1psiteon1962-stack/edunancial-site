// src/lib/i18n.ts

export const supportedLanguages = [
  "en", // English
  "es", // Spanish
  "fr", // French
  "pt", // Portuguese
  "ar", // Arabic
  "zh", // Chinese
  "ja", // Japanese
  "ko", // Korean
  "hi", // Hindi
  "de", // German
  "it", // Italian
] as const;

export type Language = typeof supportedLanguages[number];

export const isLanguage = (value: string): value is Language => {
  return (supportedLanguages as readonly string[]).includes(value);
};

/**
 * Region → allowed languages
 * Used by static param generation
 */
export const REGION_LANGUAGES: Record<string, readonly Language[]> = {
  global: supportedLanguages,
  "asia-pacific": ["en", "zh", "ja", "ko", "hi"],
};

/**
 * Central translation table.
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
  zh: {
    doctrine_title: "纲要",
    doctrine_body: "基础原则与结构。",
  },
  ja: {
    doctrine_title: "教義",
    doctrine_body: "基本原則と構造。",
  },
  ko: {
    doctrine_title: "교리",
    doctrine_body: "기본 원칙과 구조.",
  },
  hi: {
    doctrine_title: "सिद्धांत",
    doctrine_body: "मूलभूत सिद्धांत और संरचना।",
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
