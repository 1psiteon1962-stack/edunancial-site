// ======================================================
// AFRICA REGIONAL FOUNDATION
// tax.ts – Tax / VAT configuration per country
// ======================================================

export type TaxType = "VAT" | "GST" | "sales_tax" | "none";

export interface AfricaTaxConfig {
  countryIso: string;
  taxType: TaxType;
  /** Standard rate as a decimal (e.g. 0.15 = 15%) */
  standardRate: number;
  /** Reduced rate where applicable */
  reducedRate?: number;
  /** Digital-services rate (may differ from standard) */
  digitalServicesRate?: number;
  /** Human-readable name of the tax (e.g. "Value Added Tax") */
  taxName: string;
  /** Whether the platform is required to collect and remit this tax */
  collectionRequired: boolean;
  /** Whether tax-inclusive pricing is required by law */
  taxInclusivePricing: boolean;
  notes: string;
}

export const AFRICA_TAX_CONFIGS: AfricaTaxConfig[] = [
  { countryIso: "NG", taxType: "VAT",  standardRate: 0.075, digitalServicesRate: 0.075, taxName: "Value Added Tax",        collectionRequired: false, taxInclusivePricing: false, notes: "7.5 % VAT. Digital services included." },
  { countryIso: "ZA", taxType: "VAT",  standardRate: 0.15,  digitalServicesRate: 0.15,  taxName: "Value Added Tax",        collectionRequired: false, taxInclusivePricing: true,  notes: "15 % VAT on all goods & digital services." },
  { countryIso: "KE", taxType: "VAT",  standardRate: 0.16,  digitalServicesRate: 0.16,  taxName: "Value Added Tax",        collectionRequired: false, taxInclusivePricing: false, notes: "16 % VAT including digital marketplace levy." },
  { countryIso: "GH", taxType: "VAT",  standardRate: 0.125, digitalServicesRate: 0.125, taxName: "Value Added Tax",        collectionRequired: false, taxInclusivePricing: false, notes: "12.5 % VAT + 2.5 % NHIL + 1 % GetFund Levy." },
  { countryIso: "EG", taxType: "VAT",  standardRate: 0.14,  digitalServicesRate: 0.14,  taxName: "Value Added Tax",        collectionRequired: false, taxInclusivePricing: false, notes: "14 % VAT." },
  { countryIso: "MA", taxType: "VAT",  standardRate: 0.20,  digitalServicesRate: 0.20,  taxName: "Taxe sur la Valeur Ajoutée", collectionRequired: false, taxInclusivePricing: false, notes: "20 % standard VAT rate." },
  { countryIso: "TN", taxType: "VAT",  standardRate: 0.19,  digitalServicesRate: 0.19,  taxName: "Taxe sur la Valeur Ajoutée", collectionRequired: false, taxInclusivePricing: false, notes: "19 % standard VAT." },
  { countryIso: "DZ", taxType: "VAT",  standardRate: 0.19,  digitalServicesRate: 0.19,  taxName: "Taxe sur la Valeur Ajoutée", collectionRequired: false, taxInclusivePricing: false, notes: "19 % VAT." },
  { countryIso: "UG", taxType: "VAT",  standardRate: 0.18,  digitalServicesRate: 0.18,  taxName: "Value Added Tax",        collectionRequired: false, taxInclusivePricing: false, notes: "18 % VAT." },
  { countryIso: "TZ", taxType: "VAT",  standardRate: 0.18,  digitalServicesRate: 0.18,  taxName: "Value Added Tax",        collectionRequired: false, taxInclusivePricing: false, notes: "18 % VAT." },
  { countryIso: "ET", taxType: "VAT",  standardRate: 0.15,  digitalServicesRate: 0.15,  taxName: "Value Added Tax",        collectionRequired: false, taxInclusivePricing: false, notes: "15 % VAT." },
  { countryIso: "CM", taxType: "VAT",  standardRate: 0.1925,digitalServicesRate: 0.1925,taxName: "Taxe sur la Valeur Ajoutée", collectionRequired: false, taxInclusivePricing: false, notes: "19.25 % VAT." },
  { countryIso: "SN", taxType: "VAT",  standardRate: 0.18,  digitalServicesRate: 0.18,  taxName: "Taxe sur la Valeur Ajoutée", collectionRequired: false, taxInclusivePricing: false, notes: "18 % VAT." },
  { countryIso: "CI", taxType: "VAT",  standardRate: 0.18,  digitalServicesRate: 0.18,  taxName: "Taxe sur la Valeur Ajoutée", collectionRequired: false, taxInclusivePricing: false, notes: "18 % VAT." },
  { countryIso: "AO", taxType: "VAT",  standardRate: 0.14,  digitalServicesRate: 0.14,  taxName: "Imposto sobre o Valor Acrescentado", collectionRequired: false, taxInclusivePricing: false, notes: "14 % VAT." },
  { countryIso: "MZ", taxType: "VAT",  standardRate: 0.17,  digitalServicesRate: 0.17,  taxName: "Imposto sobre o Valor Acrescentado", collectionRequired: false, taxInclusivePricing: false, notes: "17 % VAT." },
];

/** Default config used when no country-specific entry is found. */
export const AFRICA_TAX_DEFAULT: AfricaTaxConfig = {
  countryIso: "default",
  taxType: "none",
  standardRate: 0,
  taxName: "None",
  collectionRequired: false,
  taxInclusivePricing: false,
  notes: "No tax collection configured. Review before activation.",
};

/** Get tax configuration for a country ISO code. */
export function getAfricaTaxConfig(countryIso: string): AfricaTaxConfig {
  return (
    AFRICA_TAX_CONFIGS.find(
      (t) => t.countryIso.toLowerCase() === countryIso.toLowerCase()
    ) ?? AFRICA_TAX_DEFAULT
  );
}

/** Calculate tax amount on a price (returns 0 when not required). */
export function calculateAfricaTax(
  amountUSD: number,
  countryIso: string
): number {
  const config = getAfricaTaxConfig(countryIso);
  if (!config.collectionRequired) return 0;
  const rate = config.digitalServicesRate ?? config.standardRate;
  return Math.round(amountUSD * rate * 100) / 100;
}
