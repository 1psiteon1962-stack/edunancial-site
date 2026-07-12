// src/config/europe/vat.ts
// European VAT architecture — rates, rules, and resolution helpers

export interface VatRate {
  standard: number;
  reduced?: number;
  superReduced?: number;
  parkingRate?: number;
}

export interface VatRule {
  countryCode: string;
  rates: VatRate;
  pricesIncludeTax: boolean;
  displayFormat: string;
  vatRegistrationRequired: boolean;
  ossEligible: boolean;
  digitalServicesVat: number;
  reverseChargeApplicable: boolean;
  thresholdEUR?: number;
}

export const EU_VAT_RULES: Record<string, VatRule> = {
  AT: {
    countryCode: "AT",
    rates: { standard: 20, reduced: 10, superReduced: 13 },
    pricesIncludeTax: true,
    displayFormat: "MwSt. {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 20,
    reverseChargeApplicable: true,
  },
  BE: {
    countryCode: "BE",
    rates: { standard: 21, reduced: 12, superReduced: 6 },
    pricesIncludeTax: true,
    displayFormat: "TVA {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 21,
    reverseChargeApplicable: true,
  },
  BG: {
    countryCode: "BG",
    rates: { standard: 20, reduced: 9 },
    pricesIncludeTax: true,
    displayFormat: "ДДС {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 20,
    reverseChargeApplicable: true,
  },
  CH: {
    countryCode: "CH",
    rates: { standard: 8.1, reduced: 2.6, superReduced: 3.8 },
    pricesIncludeTax: true,
    displayFormat: "MWST {rate}%",
    vatRegistrationRequired: false,
    ossEligible: false,
    digitalServicesVat: 8.1,
    reverseChargeApplicable: false,
    thresholdEUR: 100000,
  },
  CZ: {
    countryCode: "CZ",
    rates: { standard: 21, reduced: 12 },
    pricesIncludeTax: true,
    displayFormat: "DPH {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 21,
    reverseChargeApplicable: true,
  },
  DE: {
    countryCode: "DE",
    rates: { standard: 19, reduced: 7 },
    pricesIncludeTax: true,
    displayFormat: "MwSt. {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 19,
    reverseChargeApplicable: true,
  },
  DK: {
    countryCode: "DK",
    rates: { standard: 25 },
    pricesIncludeTax: true,
    displayFormat: "MOMS {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 25,
    reverseChargeApplicable: true,
  },
  EE: {
    countryCode: "EE",
    rates: { standard: 22, reduced: 9 },
    pricesIncludeTax: true,
    displayFormat: "KM {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 22,
    reverseChargeApplicable: true,
  },
  ES: {
    countryCode: "ES",
    rates: { standard: 21, reduced: 10, superReduced: 4 },
    pricesIncludeTax: true,
    displayFormat: "IVA {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 21,
    reverseChargeApplicable: true,
  },
  FI: {
    countryCode: "FI",
    rates: { standard: 25.5, reduced: 14, superReduced: 10 },
    pricesIncludeTax: true,
    displayFormat: "ALV {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 25.5,
    reverseChargeApplicable: true,
  },
  FR: {
    countryCode: "FR",
    rates: { standard: 20, reduced: 10, superReduced: 5.5, parkingRate: 8.5 },
    pricesIncludeTax: true,
    displayFormat: "TVA {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 20,
    reverseChargeApplicable: true,
  },
  GB: {
    countryCode: "GB",
    rates: { standard: 20, reduced: 5 },
    pricesIncludeTax: true,
    displayFormat: "VAT {rate}%",
    vatRegistrationRequired: false,
    ossEligible: false,
    digitalServicesVat: 20,
    reverseChargeApplicable: false,
    thresholdEUR: 85000,
  },
  GR: {
    countryCode: "GR",
    rates: { standard: 24, reduced: 13, superReduced: 6 },
    pricesIncludeTax: true,
    displayFormat: "ΦΠΑ {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 24,
    reverseChargeApplicable: true,
  },
  HR: {
    countryCode: "HR",
    rates: { standard: 25, reduced: 13, superReduced: 5 },
    pricesIncludeTax: true,
    displayFormat: "PDV {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 25,
    reverseChargeApplicable: true,
  },
  HU: {
    countryCode: "HU",
    rates: { standard: 27, reduced: 18, superReduced: 5 },
    pricesIncludeTax: true,
    displayFormat: "ÁFA {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 27,
    reverseChargeApplicable: true,
  },
  IE: {
    countryCode: "IE",
    rates: { standard: 23, reduced: 13.5, superReduced: 9, parkingRate: 13.5 },
    pricesIncludeTax: true,
    displayFormat: "VAT {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 23,
    reverseChargeApplicable: true,
  },
  IT: {
    countryCode: "IT",
    rates: { standard: 22, reduced: 10, superReduced: 4 },
    pricesIncludeTax: true,
    displayFormat: "IVA {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 22,
    reverseChargeApplicable: true,
  },
  LT: {
    countryCode: "LT",
    rates: { standard: 21, reduced: 9, superReduced: 5 },
    pricesIncludeTax: true,
    displayFormat: "PVM {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 21,
    reverseChargeApplicable: true,
  },
  LU: {
    countryCode: "LU",
    rates: { standard: 17, reduced: 8, superReduced: 3 },
    pricesIncludeTax: true,
    displayFormat: "TVA {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 17,
    reverseChargeApplicable: true,
  },
  LV: {
    countryCode: "LV",
    rates: { standard: 21, reduced: 12, superReduced: 5 },
    pricesIncludeTax: true,
    displayFormat: "PVN {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 21,
    reverseChargeApplicable: true,
  },
  MT: {
    countryCode: "MT",
    rates: { standard: 18, reduced: 7, superReduced: 5 },
    pricesIncludeTax: true,
    displayFormat: "VAT {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 18,
    reverseChargeApplicable: true,
  },
  NL: {
    countryCode: "NL",
    rates: { standard: 21, reduced: 9 },
    pricesIncludeTax: true,
    displayFormat: "BTW {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 21,
    reverseChargeApplicable: true,
  },
  PL: {
    countryCode: "PL",
    rates: { standard: 23, reduced: 8, superReduced: 5 },
    pricesIncludeTax: true,
    displayFormat: "VAT {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 23,
    reverseChargeApplicable: true,
  },
  PT: {
    countryCode: "PT",
    rates: { standard: 23, reduced: 13, superReduced: 6 },
    pricesIncludeTax: true,
    displayFormat: "IVA {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 23,
    reverseChargeApplicable: true,
  },
  RO: {
    countryCode: "RO",
    rates: { standard: 19, reduced: 9, superReduced: 5 },
    pricesIncludeTax: true,
    displayFormat: "TVA {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 19,
    reverseChargeApplicable: true,
  },
  SE: {
    countryCode: "SE",
    rates: { standard: 25, reduced: 12, superReduced: 6 },
    pricesIncludeTax: true,
    displayFormat: "MOMS {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 25,
    reverseChargeApplicable: true,
  },
  SI: {
    countryCode: "SI",
    rates: { standard: 22, reduced: 9.5, superReduced: 5 },
    pricesIncludeTax: true,
    displayFormat: "DDV {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 22,
    reverseChargeApplicable: true,
  },
  SK: {
    countryCode: "SK",
    rates: { standard: 20, reduced: 10 },
    pricesIncludeTax: true,
    displayFormat: "DPH {rate}%",
    vatRegistrationRequired: true,
    ossEligible: true,
    digitalServicesVat: 20,
    reverseChargeApplicable: true,
  },
};

export function resolveVatRule(countryCode: string): VatRule | undefined {
  return EU_VAT_RULES[countryCode.toUpperCase()];
}

export function getVatRate(countryCode: string): number {
  return EU_VAT_RULES[countryCode.toUpperCase()]?.rates.standard ?? 20;
}

export function formatVatDisplay(countryCode: string, rate?: number): string {
  const rule = EU_VAT_RULES[countryCode.toUpperCase()];
  if (!rule) return `VAT ${rate ?? 20}%`;
  const resolvedRate = rate ?? rule.rates.standard;
  return rule.displayFormat.replace("{rate}", String(resolvedRate));
}

export function calculateVatAmount(
  priceIncludingVat: number,
  countryCode: string
): { netAmount: number; vatAmount: number; vatRate: number } {
  const rate = getVatRate(countryCode);
  const netAmount = priceIncludingVat / (1 + rate / 100);
  const vatAmount = priceIncludingVat - netAmount;
  return {
    netAmount: Math.round(netAmount * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    vatRate: rate,
  };
}

export function isOssEligible(countryCode: string): boolean {
  return EU_VAT_RULES[countryCode.toUpperCase()]?.ossEligible ?? false;
}
