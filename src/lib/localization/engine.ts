/**
 * Global Translation & Localization Engine
 *
 * Single source of truth for all region/language configuration.
 * All regions are PRIVATE (enabled: false) until explicitly activated.
 * No region-specific logic should be duplicated outside this file.
 */

// ─── Supported languages ────────────────────────────────────────────────────

export const SUPPORTED_LANGUAGES = [
  "en", // English
  "es", // Spanish
  "fr", // French
  "pt", // Portuguese
  "ar", // Arabic
  "ja", // Japanese
  "ko", // Korean
  "de", // German
  "it", // Italian
  "tl", // Tagalog / Filipino
  "sw", // Swahili
  "zh", // Chinese (Simplified)
  "hi", // Hindi
  "tr", // Turkish
  "he", // Hebrew
] as const;

export type LocaleCode = (typeof SUPPORTED_LANGUAGES)[number];

export function isLocaleCode(value: string): value is LocaleCode {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

// ─── Region codes ────────────────────────────────────────────────────────────

export type RegionCode =
  | "us"
  | "europe"
  | "latam"
  | "africa"
  | "mena"
  | "asia"
  | "caribbean"
  | "oceania";

// ─── Region feature flags ────────────────────────────────────────────────────

/**
 * Master feature-flag map for region activation.
 * All non-US regions are PRIVATE (false) until explicitly enabled.
 */
export const REGION_FLAGS: Record<RegionCode, boolean> = {
  us:        true,   // live
  europe:    false,  // private
  latam:     false,  // private
  africa:    false,  // private
  mena:      false,  // private
  asia:      false,  // private
  caribbean: false,  // private
  oceania:   false,  // private
};

export function isRegionEnabled(region: RegionCode): boolean {
  return REGION_FLAGS[region] === true;
}

// ─── Region definition ───────────────────────────────────────────────────────

export interface RegionDefinition {
  /** Internal code */
  code: RegionCode;
  /** Human-readable name */
  name: string;
  /** Whether this region is publicly accessible */
  enabled: boolean;
  /** Language spoken first by default */
  defaultLocale: LocaleCode;
  /** All locales supported by this region */
  locales: readonly LocaleCode[];
  /** Primary currency code */
  currency: string;
  /** All accepted currencies */
  currencies: readonly string[];
  /** BCP-47 locale used for Intl.* formatters */
  intlLocale: string;
  /** RTL text direction */
  rtl: boolean;
}

// ─── Region registry ─────────────────────────────────────────────────────────

export const REGION_REGISTRY: Record<RegionCode, RegionDefinition> = {
  us: {
    code: "us",
    name: "United States",
    enabled: REGION_FLAGS.us,
    defaultLocale: "en",
    locales: ["en", "es"],
    currency: "USD",
    currencies: ["USD"],
    intlLocale: "en-US",
    rtl: false,
  },

  europe: {
    code: "europe",
    name: "Europe",
    enabled: REGION_FLAGS.europe,
    defaultLocale: "en",
    locales: ["en", "de", "fr", "it", "es", "pt"],
    currency: "EUR",
    currencies: ["EUR", "GBP", "CHF"],
    intlLocale: "en-GB",
    rtl: false,
  },

  latam: {
    code: "latam",
    name: "Latin America",
    enabled: REGION_FLAGS.latam,
    defaultLocale: "es",
    locales: ["es", "en", "pt"],
    currency: "USD",
    currencies: ["USD", "BRL", "MXN", "COP", "ARS"],
    intlLocale: "es-419",
    rtl: false,
  },

  africa: {
    code: "africa",
    name: "Africa",
    enabled: REGION_FLAGS.africa,
    defaultLocale: "en",
    locales: ["en", "fr", "sw", "ar"],
    currency: "USD",
    currencies: ["USD", "ZAR", "NGN", "KES", "GHS"],
    intlLocale: "en-NG",
    rtl: false,
  },

  mena: {
    code: "mena",
    name: "Middle East & North Africa",
    enabled: REGION_FLAGS.mena,
    defaultLocale: "ar",
    locales: ["ar", "en", "fr", "he", "tr"],
    currency: "USD",
    currencies: ["USD", "SAR", "AED", "EGP", "QAR"],
    intlLocale: "ar-SA",
    rtl: true,
  },

  asia: {
    code: "asia",
    name: "Asia",
    enabled: REGION_FLAGS.asia,
    defaultLocale: "en",
    locales: ["en", "zh", "ja", "ko", "hi", "tl"],
    currency: "USD",
    currencies: ["USD", "JPY", "CNY", "KRW", "INR", "SGD"],
    intlLocale: "en-SG",
    rtl: false,
  },

  caribbean: {
    code: "caribbean",
    name: "Caribbean",
    enabled: REGION_FLAGS.caribbean,
    defaultLocale: "en",
    locales: ["en", "es", "fr"],
    currency: "USD",
    currencies: ["USD", "DOP", "JMD", "TTD", "BBD"],
    intlLocale: "en-JM",
    rtl: false,
  },

  oceania: {
    code: "oceania",
    name: "Oceania",
    enabled: REGION_FLAGS.oceania,
    defaultLocale: "en",
    locales: ["en"],
    currency: "AUD",
    currencies: ["AUD", "NZD", "USD"],
    intlLocale: "en-AU",
    rtl: false,
  },
};

// ─── Fallback chain ──────────────────────────────────────────────────────────

/**
 * Returns a priority-ordered list of locales for looking up translations.
 * e.g. buildFallbackChain("pt", "latam") → ["pt", "es", "en"]
 */
export function buildFallbackChain(
  requested: string,
  region: RegionCode = "us",
): LocaleCode[] {
  const chain: LocaleCode[] = [];

  if (isLocaleCode(requested)) chain.push(requested);

  // Add region default if different
  const regionDef = REGION_REGISTRY[region];
  if (regionDef.defaultLocale !== requested) {
    chain.push(regionDef.defaultLocale);
  }

  // Always fall back to English last
  if (!chain.includes("en")) chain.push("en");

  return chain;
}

// ─── Translation resolver ────────────────────────────────────────────────────

export type TranslationPack = Record<string, string>;
export type TranslationTable = Partial<Record<LocaleCode, TranslationPack>>;

/**
 * Core translate function with fallback chain support.
 *
 * Tries each locale in the fallback chain and returns the first match.
 * Returns the raw `key` if no translation is found anywhere.
 */
export function translate(
  table: TranslationTable,
  locale: string,
  key: string,
  region: RegionCode = "us",
): string {
  const chain = buildFallbackChain(locale, region);
  for (const loc of chain) {
    const value = table[loc]?.[key];
    if (value !== undefined) return value;
  }
  return key;
}

// ─── Runtime locale resolver ─────────────────────────────────────────────────

/**
 * Resolves the best available locale for a given request.
 * Priority: explicit preference → browser/header hint → region default → "en"
 */
export function resolveLocale(
  region: RegionCode,
  preference?: string | null,
  browserHint?: string | null,
): LocaleCode {
  const def = REGION_REGISTRY[region];

  const candidates = [preference, browserHint].flatMap((raw) => {
    if (!raw) return [];
    // Accept both "es" and "es-419" style
    const base = raw.split("-")[0].toLowerCase();
    return [raw, base];
  });

  for (const candidate of candidates) {
    if (isLocaleCode(candidate) && def.locales.includes(candidate as LocaleCode)) {
      return candidate as LocaleCode;
    }
  }

  return def.defaultLocale;
}
