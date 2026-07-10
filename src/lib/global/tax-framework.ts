/**
 * Global Tax Framework
 *
 * Configuration-driven tax abstraction.
 * No hard-coded tax rates or logic — all rates come from region/country configs.
 * Compatible with: VAT (Europe), GST, Sales Tax, IVA (LATAM), and any future taxonomy.
 */

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type TaxType =
  | "VAT"       // Value Added Tax (EU, UK)
  | "GST"       // Goods and Services Tax
  | "IVA"       // Impuesto al Valor Agregado (LATAM)
  | "SALES_TAX" // US-style sales tax
  | "NONE"      // No tax applicable
  | string;     // Extensible — new types via config only

export interface TaxRate {
  /** Human-readable label */
  label: string;
  /** Tax type taxonomy */
  type: TaxType;
  /** Standard rate as a decimal fraction (e.g. 0.16 = 16%) */
  standardRate: number;
  /** Reduced rate if applicable */
  reducedRate?: number;
  /** Exempt categories (informational) */
  exemptions?: string[];
}

export interface CountryTaxConfig {
  /** ISO 3166-1 alpha-2 country code (lowercase) */
  countryCode: string;
  tax: TaxRate;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/**
 * Build a tax registry lookup from an array of CountryTaxConfig.
 * Each region passes its own config array — no global hard-coding.
 */
export function buildTaxRegistry(
  configs: CountryTaxConfig[]
): Record<string, TaxRate> {
  return configs.reduce<Record<string, TaxRate>>((acc, cfg) => {
    acc[cfg.countryCode.toLowerCase()] = cfg.tax;
    return acc;
  }, {});
}

/**
 * Look up the tax rate for a given country code from a registry.
 * Returns undefined if the country has no registered tax config.
 */
export function getTaxRate(
  countryCode: string,
  registry: Record<string, TaxRate>
): TaxRate | undefined {
  return registry[countryCode.toLowerCase()];
}

/**
 * Calculate tax amount from a base price.
 * Returns 0 if no tax config found.
 */
export function calculateTax(
  basePrice: number,
  countryCode: string,
  registry: Record<string, TaxRate>,
  useReducedRate = false
): number {
  const rate = getTaxRate(countryCode, registry);
  if (!rate || rate.type === "NONE") return 0;
  const effectiveRate = useReducedRate ? (rate.reducedRate ?? rate.standardRate) : rate.standardRate;
  return parseFloat((basePrice * effectiveRate).toFixed(2));
}

/**
 * Return the total (base + tax) price for a given country.
 */
export function getPriceWithTax(
  basePrice: number,
  countryCode: string,
  registry: Record<string, TaxRate>,
  useReducedRate = false
): number {
  return parseFloat(
    (basePrice + calculateTax(basePrice, countryCode, registry, useReducedRate)).toFixed(2)
  );
}
