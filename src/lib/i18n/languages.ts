import { LanguageCode } from "../regions";

export const supportedLanguages: LanguageCode[] = [
  "en",
  "es",
  "ko",
  "ja",
  "tl",
  "ar",
  "pt",
  "fr"
];

export function isLanguage(value: unknown): value is LanguageCode {
  return typeof value === "string" &&
    supportedLanguages.includes(value as LanguageCode);
}
