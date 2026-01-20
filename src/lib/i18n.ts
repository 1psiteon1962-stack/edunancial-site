export const DEFAULT_LANGUAGE = "en";

export function t(key: string, lang: string = DEFAULT_LANGUAGE): string {
  return key;
}

export function isLanguage(lang: unknown): lang is string {
  return typeof lang === "string" && lang.length > 0;
}
