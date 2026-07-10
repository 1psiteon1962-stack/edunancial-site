import {
  DEFAULT_LANGUAGE,
  LOCALE_STORAGE_KEY,
  isLanguage,
  type SupportedLanguage,
} from "./languages";

const localeAliases: Record<string, SupportedLanguage> = {
  fil: "tl",
  "pt-br": "pt",
  "pt-pt": "pt",
  "es-419": "es",
};

function normalizeLocale(rawLocale: string | null | undefined): string {
  return rawLocale?.toLowerCase() ?? "";
}

function mapToSupportedLocale(rawLocale: string | null | undefined): SupportedLanguage | null {
  const normalized = normalizeLocale(rawLocale);

  if (!normalized) {
    return null;
  }

  const alias = localeAliases[normalized];
  if (alias) {
    return alias;
  }

  if (isLanguage(normalized)) {
    return normalized;
  }

  const baseLocale = normalized.split(/[-_]/)[0];
  if (isLanguage(baseLocale)) {
    return baseLocale;
  }

  return localeAliases[baseLocale] ?? null;
}

export function detectBrowserLocale(): string {
  if (typeof navigator === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const browserLocales = [navigator.language, ...(navigator.languages ?? [])];
  for (const candidate of browserLocales) {
    const locale = mapToSupportedLocale(candidate);
    if (locale) {
      return locale;
    }
  }

  return DEFAULT_LANGUAGE;
}

export function detectLocaleFromUrl(pathname: string): string | null {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return mapToSupportedLocale(firstSegment);
}

export function getPreferredLocale(): string {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const storedLocale = mapToSupportedLocale(
    window.localStorage.getItem(LOCALE_STORAGE_KEY)
  );
  if (storedLocale) {
    return storedLocale;
  }

  const urlLocale = detectLocaleFromUrl(window.location.pathname);
  if (urlLocale) {
    return urlLocale;
  }

  return detectBrowserLocale();
}
