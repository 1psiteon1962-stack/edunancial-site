// src/lib/i18n.ts

/**
 * Canonical language type for the entire application.
 * ALL language logic must use this definition.
 */
export type Language =
  | "en" // English
  | "es" // Spanish
  | "fr" // French
  | "ar" // Arabic
  | "ja" // Japanese
  | "ko" // Korean
  | "de" // German
  | "it"; // Italian

/**
 * Ordered list of supported languages (single source of truth).
 */
export const supportedLanguages = [
  "en",
  "es",
  "fr",
  "ar",
  "ja",
  "ko",
  "de",
  "it",
] as const;

/**
 * Runtime guard for validating language strings.
 */
export function isLanguage(value: string): value is Language {
  return (supportedLanguages as readonly string[]).includes(value);
}

/**
 * Translation dictionaries.
 * Keys may safely differ per language; fallback handled in `t`.
 */
const dictionaries: Record<Language, Record<string, string>> = {
  en: {
    doctrine_title: "Doctrine",
    doctrine_body: "Our guiding principles and foundational beliefs.",
  },
  es: {
    doctrine_title: "Doctrina",
    doctrine_body: "Nuestros principios rectores y creencias fundamentales.",
  },
  fr: {
    doctrine_title: "Doctrine",
    doctrine_body: "Nos principes directeurs et nos convictions fondamentales.",
  },
  ar: {
    doctrine_title: "العقيدة",
    doctrine_body: "مبادئنا التوجيهية ومعتقداتنا الأساسية.",
  },
  ja: {
    doctrine_title: "理念",
    doctrine_body: "私たちの指針となる原則と基本的な信念。",
  },
  ko: {
    doctrine_title: "원칙",
    doctrine_body: "우리의 지침이 되는 원칙과 핵심 신념.",
  },
  de: {
    doctrine_title: "Doktrin",
    doctrine_body: "Unsere leitenden Prinzipien und grundlegenden Überzeugungen.",
  },
  it: {
    doctrine_title: "Dottrina",
    doctrine_body: "I nostri principi guida e le convinzioni fondamentali.",
  },
};

/**
 * Translation helper.
 * Falls back to the key itself if no translation exists.
 */
export function t(lang: Language, key: string): string {
  return dictionaries[lang]?.[key] ?? key;
}
