/** Country pricing pilot registry. All amounts are integer minor currency units.
 * DRAFT policies are preview-only; never charge against these amounts.
 * US/CA existing prices remain authoritative in the legacy catalog until migration is approved.
 */
export type PricingStatus = "DRAFT" | "APPROVED" | "ACTIVE";
export type PlanPrices = { monthly: number; annual: number };
export type CountryPolicy = {
  countryCode: string;
  countryName: string;
  defaultLocale: string;
  availableLocales: readonly string[];
  currencyCode: string;
  currencySymbol: string;
  decimals: number;
  pricingStatus: PricingStatus;
  prices: { basic: PlanPrices; pro: PlanPrices; gold: PlanPrices } | null;
  version: string;
  effectiveDate: string;
};
const draft = "2026-10-11";
export const COUNTRY_POLICIES: Readonly<Record<string, CountryPolicy>> = {
  DO: { countryCode:"DO",countryName:"Dominican Republic",defaultLocale:"es-DO",availableLocales:["es-DO","es-419","en-US"],currencyCode:"DOP",currencySymbol:"RD$",decimals:2,pricingStatus:"DRAFT",prices:{basic:{monthly:39900,annual:319900},pro:{monthly:69900,annual:559900},gold:{monthly:99900,annual:799900}},version:"do-pilot-v1",effectiveDate:draft },
  JM: { countryCode:"JM",countryName:"Jamaica",defaultLocale:"en-JM",availableLocales:["en-JM","en-US"],currencyCode:"JMD",currencySymbol:"J$",decimals:2,pricingStatus:"DRAFT",prices:null,version:"jm-draft-v1",effectiveDate:draft },
  TC: { countryCode:"TC",countryName:"Turks and Caicos",defaultLocale:"en-US",availableLocales:["en-US"],currencyCode:"USD",currencySymbol:"$",decimals:2,pricingStatus:"DRAFT",prices:null,version:"tc-draft-v1",effectiveDate:draft },
  GP: { countryCode:"GP",countryName:"Guadeloupe",defaultLocale:"fr-FR",availableLocales:["fr-FR","en-US"],currencyCode:"EUR",currencySymbol:"€",decimals:2,pricingStatus:"DRAFT",prices:null,version:"gp-draft-v1",effectiveDate:draft },
  BB: { countryCode:"BB",countryName:"Barbados",defaultLocale:"en-US",availableLocales:["en-US"],currencyCode:"BBD",currencySymbol:"Bds$",decimals:2,pricingStatus:"DRAFT",prices:null,version:"bb-draft-v1",effectiveDate:draft },
  US: { countryCode:"US",countryName:"United States",defaultLocale:"en-US",availableLocales:["en-US","es-419"],currencyCode:"USD",currencySymbol:"$",decimals:2,pricingStatus:"ACTIVE",prices:{basic:{monthly:1499,annual:11999},pro:{monthly:2499,annual:19999},gold:{monthly:3999,annual:29999}},version:"us-existing-2026",effectiveDate:draft },
  CA: { countryCode:"CA",countryName:"Canada",defaultLocale:"en-US",availableLocales:["en-US","fr-CA"],currencyCode:"CAD",currencySymbol:"C$",decimals:2,pricingStatus:"DRAFT",prices:null,version:"ca-legacy-unchanged",effectiveDate:draft },
};
export function getCountryPolicy(code: string): CountryPolicy | null {
  return COUNTRY_POLICIES[code.toUpperCase()] ?? null;
}
export function previewCountryPrice(code: string, plan: keyof NonNullable<CountryPolicy["prices"]>, interval: keyof PlanPrices): number | null {
  const policy = getCountryPolicy(code);
  return policy?.prices?.[plan]?.[interval] ?? null;
}
