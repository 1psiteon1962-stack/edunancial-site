import type { CountryConfiguration } from "@/types/country-config";

function planningCountry(
  isoCode: string,
  country: string,
  continent: string,
  currency: string,
  language: string,
): CountryConfiguration {
  return {
    isoCode,
    country,
    continent,
    enabled: false,
    status: "planning",
    membershipEnabled: false,
    marketplaceEnabled: false,
    paymentsEnabled: false,
    coursesEnabled: false,
    assessmentsEnabled: false,
    hiringEnabled: false,
    aiEnabled: false,
    operatingEntity: "",
    currency,
    language,
  };
}

/**
 * Priority markets missing from the legacy country registry.
 *
 * These records are intentionally disabled and planning-only. Adding them to
 * the catalog makes them visible to rollout/admin architecture without
 * enabling customer access, payments, courses, or commercial activity.
 */
export const priorityExpansionCountries: CountryConfiguration[] = [
  // Latin America
  planningCountry("MX", "Mexico", "Latin America", "MXN", "Spanish"),
  planningCountry("BR", "Brazil", "Latin America", "BRL", "Portuguese"),
  planningCountry("CO", "Colombia", "Latin America", "COP", "Spanish"),
  planningCountry("AR", "Argentina", "Latin America", "ARS", "Spanish"),
  planningCountry("CL", "Chile", "Latin America", "CLP", "Spanish"),
  planningCountry("PE", "Peru", "Latin America", "PEN", "Spanish"),

  // Caribbean
  planningCountry("PR", "Puerto Rico", "Caribbean", "USD", "Spanish"),
  planningCountry("DO", "Dominican Republic", "Caribbean", "DOP", "Spanish"),
  planningCountry("JM", "Jamaica", "Caribbean", "JMD", "English"),
  planningCountry("BB", "Barbados", "Caribbean", "BBD", "English"),
  planningCountry("BS", "Bahamas", "Caribbean", "BSD", "English"),
  planningCountry("KY", "Cayman Islands", "Caribbean", "KYD", "English"),
  planningCountry("TC", "Turks and Caicos Islands", "Caribbean", "USD", "English"),

  // Western Europe
  planningCountry("GB", "United Kingdom", "Europe", "GBP", "English"),
  planningCountry("ES", "Spain", "Europe", "EUR", "Spanish"),
  planningCountry("FR", "France", "Europe", "EUR", "French"),
  planningCountry("DE", "Germany", "Europe", "EUR", "German"),
  planningCountry("IT", "Italy", "Europe", "EUR", "Italian"),
  planningCountry("NL", "Netherlands", "Europe", "EUR", "Dutch"),
  planningCountry("PT", "Portugal", "Europe", "EUR", "Portuguese"),
];
