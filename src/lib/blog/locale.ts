const HREFLANG_BY_INTERNAL_LOCALE: Record<string, string> = {
  "en-US": "en-US",
  "en-GB": "en-GB",
  "es-Caribbean": "es-419",
  "es-419": "es-419",
  "es-ES": "es-ES",
  "fr-CA": "fr-CA",
  "fr-FR": "fr-FR",
  "pt-BR": "pt-BR",
  "pt-PT": "pt-PT",
  de: "de",
  it: "it",
  nl: "nl",
  ht: "ht",
};

export function blogHreflang(locale: string): string {
  return HREFLANG_BY_INTERNAL_LOCALE[locale] ?? locale;
}

export function isValidBlogLocale(locale: string): boolean {
  return Object.prototype.hasOwnProperty.call(HREFLANG_BY_INTERNAL_LOCALE, locale);
}
