/**
 * Canonical locale configuration.
 *
 * This module re-exports the authoritative locale registry from
 * `src/lib/international/languages.ts` so that any module can import
 * locale definitions from a single, stable path without depending on the
 * internal directory structure.
 *
 * Adding a new locale requires only:
 *   1. Register the locale in `src/lib/international/languages.ts`
 *   2. Add translation resources to `src/locales/<code>.json`
 *   3. Register the messages in `src/lib/international/i18n.ts`
 * No page-specific programming is required.
 */

export {
  LANGUAGE_CATALOG,
  LANGUAGE_ALIAS_MAP,
  FRAMEWORK_READY_LANGUAGE_CODES,
  DEFAULT_LANGUAGE_CODE as DEFAULT_LOCALE,
  FALLBACK_LANGUAGE_CODE as FALLBACK_LOCALE,
  getLanguageByCode,
  isLanguageSupported,
  normalizeLanguageCode,
  isRtlLanguage,
  type LanguageDefinition,
} from "@/lib/international/languages";

export {
  resolveLocale,
  matchSupportedLocale,
  parseAcceptLanguage,
  type ResolveLocaleInput,
} from "@/lib/international/resolve-locale";

export { LANGUAGE_COOKIE_NAME } from "@/lib/international/preferences";
