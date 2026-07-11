/**
 * Currency formatting module
 *
 * Locale-aware currency formatting using the native Intl.NumberFormat API.
 * No external dependencies.
 */

import { RegionCode, REGION_REGISTRY } from "./engine";

// ─── Currency metadata ───────────────────────────────────────────────────────

export interface CurrencyMeta {
  code: string;
  symbol: string;
  decimals: number;
  /** BCP-47 locale used for Intl formatting */
  intlLocale: string;
}

export const CURRENCY_META: Record<string, CurrencyMeta> = {
  USD: { code: "USD", symbol: "$",    decimals: 2, intlLocale: "en-US" },
  EUR: { code: "EUR", symbol: "€",    decimals: 2, intlLocale: "en-GB" },
  GBP: { code: "GBP", symbol: "£",    decimals: 2, intlLocale: "en-GB" },
  CHF: { code: "CHF", symbol: "Fr",   decimals: 2, intlLocale: "de-CH" },
  CAD: { code: "CAD", symbol: "C$",   decimals: 2, intlLocale: "en-CA" },
  AUD: { code: "AUD", symbol: "A$",   decimals: 2, intlLocale: "en-AU" },
  NZD: { code: "NZD", symbol: "NZ$",  decimals: 2, intlLocale: "en-NZ" },
  BRL: { code: "BRL", symbol: "R$",   decimals: 2, intlLocale: "pt-BR" },
  MXN: { code: "MXN", symbol: "MX$",  decimals: 2, intlLocale: "es-MX" },
  COP: { code: "COP", symbol: "COP$", decimals: 0, intlLocale: "es-CO" },
  ARS: { code: "ARS", symbol: "AR$",  decimals: 2, intlLocale: "es-AR" },
  JPY: { code: "JPY", symbol: "¥",    decimals: 0, intlLocale: "ja-JP" },
  CNY: { code: "CNY", symbol: "¥",    decimals: 2, intlLocale: "zh-CN" },
  KRW: { code: "KRW", symbol: "₩",    decimals: 0, intlLocale: "ko-KR" },
  INR: { code: "INR", symbol: "₹",    decimals: 2, intlLocale: "en-IN" },
  SGD: { code: "SGD", symbol: "S$",   decimals: 2, intlLocale: "en-SG" },
  SAR: { code: "SAR", symbol: "﷼",    decimals: 2, intlLocale: "ar-SA" },
  AED: { code: "AED", symbol: "د.إ",  decimals: 2, intlLocale: "ar-AE" },
  EGP: { code: "EGP", symbol: "£",    decimals: 2, intlLocale: "ar-EG" },
  QAR: { code: "QAR", symbol: "﷼",    decimals: 2, intlLocale: "ar-QA" },
  ZAR: { code: "ZAR", symbol: "R",    decimals: 2, intlLocale: "en-ZA" },
  NGN: { code: "NGN", symbol: "₦",    decimals: 2, intlLocale: "en-NG" },
  KES: { code: "KES", symbol: "Ksh",  decimals: 2, intlLocale: "sw-KE" },
  GHS: { code: "GHS", symbol: "₵",    decimals: 2, intlLocale: "en-GH" },
  DOP: { code: "DOP", symbol: "RD$",  decimals: 2, intlLocale: "es-DO" },
  JMD: { code: "JMD", symbol: "J$",   decimals: 2, intlLocale: "en-JM" },
  TTD: { code: "TTD", symbol: "TT$",  decimals: 2, intlLocale: "en-TT" },
  BBD: { code: "BBD", symbol: "Bds$", decimals: 2, intlLocale: "en-BB" },
};

// ─── Formatter ───────────────────────────────────────────────────────────────

export interface FormatCurrencyOptions {
  /** ISO 4217 currency code, e.g. "USD". Defaults to region primary. */
  currency?: string;
  /** Override the display locale (BCP-47). Falls back to currency's intlLocale. */
  locale?: string;
  /** Show cents / fractional digits (default: true) */
  showDecimals?: boolean;
}

/**
 * Formats a numeric amount as a locale-aware currency string.
 *
 * @example
 *   formatCurrency(1234.5, "us")              // "$1,234.50"
 *   formatCurrency(1234.5, "europe", { currency: "EUR" }) // "€1,234.50"
 */
export function formatCurrency(
  amount: number,
  region: RegionCode,
  options: FormatCurrencyOptions = {},
): string {
  const regionDef = REGION_REGISTRY[region];
  const currencyCode = options.currency ?? regionDef.currency;
  const meta = CURRENCY_META[currencyCode];
  const intlLocale = options.locale ?? meta?.intlLocale ?? regionDef.intlLocale;
  const decimals = options.showDecimals === false ? 0 : (meta?.decimals ?? 2);

  try {
    return new Intl.NumberFormat(intlLocale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  } catch {
    // Graceful degradation: simple symbol + number
    const symbol = meta?.symbol ?? currencyCode;
    return `${symbol}${amount.toFixed(decimals)}`;
  }
}

/**
 * Returns the primary currency code for a region.
 */
export function getRegionCurrency(region: RegionCode): string {
  return REGION_REGISTRY[region].currency;
}

/**
 * Returns all supported currency codes for a region.
 */
export function getRegionCurrencies(region: RegionCode): readonly string[] {
  return REGION_REGISTRY[region].currencies;
}
