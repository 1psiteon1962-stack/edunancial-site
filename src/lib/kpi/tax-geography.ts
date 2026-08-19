export type TaxGeographyLevel = "COUNTRY" | "STATE_PROVINCE_REGION" | "LOCAL";

export interface TaxGeographyKey {
  countryCode: string;
  subdivisionCode: string | null;
  localityCode: string | null;
  regionCode: string;
}

export interface GeographicTaxPosition extends TaxGeographyKey {
  jurisdictionName: string;
  level: TaxGeographyLevel;
  currency: string;
  salesOrConsumptionTaxCollected: number | null;
  salesOrConsumptionTaxRemitted: number | null;
  salesOrConsumptionTaxDue: number | null;
  incomeTaxDue: number | null;
  payrollTaxDue: number | null;
  franchiseTaxDue: number | null;
  propertyTaxDue: number | null;
  otherTaxDue: number | null;
  totalTaxDue: number | null;
  registrationStatus: "REGISTERED" | "NOT_REGISTERED" | "PENDING" | "NOT_REQUIRED" | "UNKNOWN";
  filingFrequency: string | null;
  nextFilingDueAt: string | null;
  source: string | null;
  ruleVersion: string | null;
  asOf: string;
}

export interface GeographicTaxRollup {
  byCountry: GeographicTaxPosition[];
  bySubdivision: GeographicTaxPosition[];
  byLocality: GeographicTaxPosition[];
  businessTotal: GeographicTaxPosition | null;
}

export const TAX_GEOGRAPHY_REQUIREMENTS = [
  "Every tax record must include an ISO country code.",
  "Where a tax is imposed below country level, the record must include the state, province, territory, department, parish or equivalent subdivision code.",
  "Where local tax applies, preserve the locality separately rather than collapsing it into the state or country total.",
  "United States reporting must support state and local sales-tax rollups plus a national business total.",
  "Canada reporting must support province/territory GST, HST, QST, PST or RST components plus a national business total.",
  "Central America, South America and Caribbean reporting must preserve country and applicable subnational jurisdiction independently.",
  "Dashboard totals must be derived from jurisdiction records so country, regional and whole-business totals reconcile.",
  "Currency conversion used for consolidated reporting must retain the original currency amount, reporting currency, FX rate and FX as-of date.",
  "No unavailable jurisdiction value may be represented as zero.",
] as const;
