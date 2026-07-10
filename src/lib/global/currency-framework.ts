/**
 * Global Currency Framework
 *
 * Configuration-driven currency registry.
 * Add new currencies by extending GLOBAL_CURRENCIES — no code changes required
 * in consuming modules.
 *
 * Compatible with all present and future regions.
 */

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface CurrencyConfig {
  /** ISO 4217 currency code */
  code: string;
  /** Display symbol */
  symbol: string;
  /** Human-readable name in English */
  name: string;
  /** Number of decimal places for display (default 2) */
  decimals: number;
  /** ISO 639-1 locale for Intl.NumberFormat (e.g. "es-MX") */
  locale: string;
}

// ─────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────

/**
 * Global currency registry.
 * Key is the ISO 4217 code (uppercase).
 * Extend here to add currencies without touching other modules.
 */
export const GLOBAL_CURRENCIES: Record<string, CurrencyConfig> = {
  // ── North America ──────────────────────────
  USD: { code: "USD", symbol: "$",   name: "US Dollar",              decimals: 2, locale: "en-US" },
  CAD: { code: "CAD", symbol: "CA$", name: "Canadian Dollar",        decimals: 2, locale: "en-CA" },

  // ── Europe ─────────────────────────────────
  EUR: { code: "EUR", symbol: "€",   name: "Euro",                   decimals: 2, locale: "de-DE" },
  GBP: { code: "GBP", symbol: "£",   name: "British Pound",          decimals: 2, locale: "en-GB" },
  CHF: { code: "CHF", symbol: "CHF", name: "Swiss Franc",            decimals: 2, locale: "de-CH" },

  // ── LATAM ──────────────────────────────────
  MXN: { code: "MXN", symbol: "MX$", name: "Mexican Peso",           decimals: 2, locale: "es-MX" },
  BRL: { code: "BRL", symbol: "R$",  name: "Brazilian Real",         decimals: 2, locale: "pt-BR" },
  ARS: { code: "ARS", symbol: "$",   name: "Argentine Peso",         decimals: 2, locale: "es-AR" },
  COP: { code: "COP", symbol: "$",   name: "Colombian Peso",         decimals: 0, locale: "es-CO" },
  PEN: { code: "PEN", symbol: "S/",  name: "Peruvian Sol",           decimals: 2, locale: "es-PE" },
  CLP: { code: "CLP", symbol: "$",   name: "Chilean Peso",           decimals: 0, locale: "es-CL" },
  VES: { code: "VES", symbol: "Bs.", name: "Venezuelan Bolívar",     decimals: 2, locale: "es-VE" },
  BOB: { code: "BOB", symbol: "Bs.", name: "Bolivian Boliviano",     decimals: 2, locale: "es-BO" },
  PYG: { code: "PYG", symbol: "₲",  name: "Paraguayan Guaraní",     decimals: 0, locale: "es-PY" },
  UYU: { code: "UYU", symbol: "$U",  name: "Uruguayan Peso",         decimals: 2, locale: "es-UY" },
  GTQ: { code: "GTQ", symbol: "Q",   name: "Guatemalan Quetzal",     decimals: 2, locale: "es-GT" },
  HNL: { code: "HNL", symbol: "L",   name: "Honduran Lempira",       decimals: 2, locale: "es-HN" },
  NIO: { code: "NIO", symbol: "C$",  name: "Nicaraguan Córdoba",     decimals: 2, locale: "es-NI" },
  CRC: { code: "CRC", symbol: "₡",  name: "Costa Rican Colón",      decimals: 2, locale: "es-CR" },
  PAB: { code: "PAB", symbol: "B/.", name: "Panamanian Balboa",      decimals: 2, locale: "es-PA" },
  BZD: { code: "BZD", symbol: "BZ$", name: "Belize Dollar",          decimals: 2, locale: "en-BZ" },
  SVC: { code: "SVC", symbol: "₡",  name: "Salvadoran Colón",       decimals: 2, locale: "es-SV" },
  DOP: { code: "DOP", symbol: "RD$", name: "Dominican Peso",         decimals: 2, locale: "es-DO" },
  CUP: { code: "CUP", symbol: "$",   name: "Cuban Peso",             decimals: 2, locale: "es-CU" },
  JMD: { code: "JMD", symbol: "J$",  name: "Jamaican Dollar",        decimals: 2, locale: "en-JM" },
  HTG: { code: "HTG", symbol: "G",   name: "Haitian Gourde",         decimals: 2, locale: "fr-HT" },
  TTD: { code: "TTD", symbol: "TT$", name: "Trinidad and Tobago Dollar", decimals: 2, locale: "en-TT" },
  SRD: { code: "SRD", symbol: "SR$", name: "Surinamese Dollar",      decimals: 2, locale: "nl-SR" },
  GYD: { code: "GYD", symbol: "G$",  name: "Guyanese Dollar",        decimals: 2, locale: "en-GY" },
  ECU: { code: "ECU", symbol: "$",   name: "Ecuadorian (uses USD)",   decimals: 2, locale: "es-EC" },
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Look up a currency by ISO code. Returns undefined if not in registry. */
export function getCurrency(code: string): CurrencyConfig | undefined {
  return GLOBAL_CURRENCIES[code.toUpperCase()];
}

/**
 * Format a monetary amount using the registry locale.
 * Falls back to raw number string if currency not found.
 */
export function formatCurrency(amount: number, code: string): string {
  const cfg = getCurrency(code);
  if (!cfg) return `${amount} ${code}`;
  try {
    return new Intl.NumberFormat(cfg.locale, {
      style: "currency",
      currency: cfg.code,
      minimumFractionDigits: cfg.decimals,
      maximumFractionDigits: cfg.decimals,
    }).format(amount);
  } catch {
    return `${cfg.symbol}${amount.toFixed(cfg.decimals)}`;
  }
}
