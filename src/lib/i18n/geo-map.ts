/**
 * Geographic region → locale mapping.
 *
 * Maps ISO 3166 country codes (and select region/province codes) to the most
 * appropriate default locale for that location.
 *
 * This is a lower-priority fallback signal used only when no browser language
 * preference is available.  It is intentionally conservative — the visitor is
 * never forced into a language based solely on geography.
 *
 * To add a new mapping, append an entry to `GEO_LOCALE_MAP` using the
 * uppercase ISO 3166-1 alpha-2 country code as the key.  Sub-region codes
 * follow the pattern `<COUNTRY>-<REGION>` (e.g. `CA-QC` for Quebec).
 */

/** Country / region code → supported locale code. */
export const GEO_LOCALE_MAP: Record<string, string> = {
  // North America
  US: "en-US",
  PR: "es", // Puerto Rico → Spanish
  CA: "en-US", // Canada default — overridden at sub-region level
  "CA-QC": "fr-CA", // Quebec → French (Canada)
  MX: "es",
  // Caribbean
  DO: "es",
  CU: "es",
  HT: "ht",
  // Central America
  GT: "es",
  SV: "es",
  HN: "es",
  NI: "es",
  CR: "es",
  PA: "es",
  // South America
  AR: "es",
  BO: "es",
  CL: "es",
  CO: "es",
  EC: "es",
  PY: "es",
  PE: "es",
  UY: "es",
  VE: "es",
  BR: "pt",
  // Europe
  FR: "fr-FR",
  BE: "fr-FR",
  CH: "fr-FR",
  DE: "de",
  AT: "de",
  IT: "it",
  NL: "nl",
  PT: "pt",
  ES: "es",
  // Middle East
  SA: "ar",
  AE: "ar",
  QA: "ar",
  KW: "ar",
  BH: "ar",
  OM: "ar",
  IQ: "ar",
  JO: "ar",
  LB: "ar",
  SY: "ar",
  YE: "ar",
  EG: "ar",
  // South Asia
  IN: "hi",
  PK: "ur",
  BD: "bn",
  // East Asia
  CN: "zh-Hans",
  HK: "zh-Hant",
  TW: "zh-Hant",
  MO: "zh-Hant",
  SG: "zh-Hans",
  JP: "ja",
  KR: "ko",
  // Southeast Asia
  PH: "fil",
  MY: "ms",
  ID: "id",
  // Africa
  NG: "ha",
  KE: "sw",
  TZ: "sw",
  UG: "sw",
  ET: "am",
  ZA: "zu",
  // Oceania — default to English
  AU: "en-US",
  NZ: "en-US",
} as const;

/**
 * Returns the recommended locale for the given geographic region identifier,
 * or `null` if no mapping exists.
 *
 * @param region  ISO 3166-1 alpha-2 country code, optionally extended with a
 *                region/province suffix (e.g. `"CA-QC"` for Quebec).
 */
export function mapGeoToLocale(region?: string | null): string | null {
  if (!region) return null;
  const key = region.trim().toUpperCase();
  // Try full sub-region code first, then fall back to country code.
  return GEO_LOCALE_MAP[key] ?? GEO_LOCALE_MAP[key.split("-")[0]] ?? null;
}
