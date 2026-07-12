import { LANGUAGE_CATALOG } from "./international/languages";

export const supportedLanguages = LANGUAGE_CATALOG.map((language) => language.code) as readonly string[];

export type Language = string;

export const isLanguage = (value: string): value is Language => {
  return supportedLanguages.includes(value);
};

export const REGION_LANGUAGES: Record<string, readonly string[]> = {
  global: supportedLanguages,
};

const translations: Record<string, Record<string, string>> = {
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

