import { translateStatic } from "./registry";

export const LOCALE_LANG_MAP: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  pt: "pt-PT",
  it: "it-IT",
  nl: "nl-NL",
  ko: "ko-KR",
  ja: "ja-JP",
  tl: "fil-PH",
  ar: "ar-SA",
};

export function getAriaLabel(key: string, locale: string): string {
  return translateStatic(locale, key);
}

export function getHtmlLang(locale: string): string {
  return LOCALE_LANG_MAP[locale] ?? locale;
}
