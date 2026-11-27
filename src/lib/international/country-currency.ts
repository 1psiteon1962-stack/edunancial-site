import pricingData from "./country-pricing-data.json";

/**
 * Official local currency (ISO 4217) for a country (ISO 3166-1 alpha-2).
 *
 * Single source of truth: country-pricing-data.json, the same dataset that
 * drives country pricing. Covers every country in that dataset, so no
 * country silently falls back to USD because it is missing from a short,
 * hand-maintained list (e.g. Uganda -> UGX, not USD).
 */
const COUNTRY_ROWS = pricingData.countries as Record<string, { c?: string }>;

export function getCountryCurrency(countryCode: string | null | undefined): string | null {
  const code = String(countryCode ?? "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return null;
  const currency = COUNTRY_ROWS[code]?.c;
  return typeof currency === "string" && /^[A-Z]{3}$/.test(currency) ? currency : null;
}
