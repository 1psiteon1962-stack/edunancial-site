import { getCountryPolicy, type PlanPrices } from "./country-policies";

/** Preview-only presentation quote. Never use this function to initiate a payment. */
export type PreviewPriceResult =
  | { kind: "price"; countryCode: string; currencyCode: string; amountMinor: number; decimals: number; version: string }
  | { kind: "coming-soon"; countryCode: string; currencyCode: string }
  | { kind: "unavailable"; countryCode: string };

export function resolvePreviewPrice(
  countryCode: string,
  plan: "basic" | "pro" | "gold",
  interval: keyof PlanPrices,
  previewEnabled: boolean,
): PreviewPriceResult {
  const country = getCountryPolicy(countryCode);
  if (!country) return { kind: "unavailable", countryCode: countryCode.toUpperCase() };
  if (country.pricingStatus !== "ACTIVE" && !previewEnabled) {
    return { kind: "coming-soon", countryCode: country.countryCode, currencyCode: country.currencyCode };
  }
  const amountMinor = country.prices?.[plan]?.[interval];
  if (amountMinor === undefined || !Number.isSafeInteger(amountMinor) || amountMinor < 0) {
    return { kind: "coming-soon", countryCode: country.countryCode, currencyCode: country.currencyCode };
  }
  return { kind: "price", countryCode: country.countryCode, currencyCode: country.currencyCode, amountMinor, decimals: country.decimals, version: country.version };
}

export function formatPreviewPrice(result: Extract<PreviewPriceResult, { kind: "price" }>, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: result.currencyCode,
    minimumFractionDigits: result.decimals,
    maximumFractionDigits: result.decimals,
  }).format(result.amountMinor / (10 ** result.decimals));
}
