export * from "./i18n/index";

import { languages } from "./i18n/languages";
import { translateStatic } from "./i18n/registry";

export function t(
  locale: string,
  key: string,
  params?: Record<string, string>
): string {
  return translateStatic(locale, key, params);
}


export const REGION_LANGUAGES = {
  global: languages,
} as const;
