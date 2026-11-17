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

  // Western Europe (owner-approved wave 4, 2026-11-17)
  planningCountry("IE", "Ireland", "Europe", "EUR", "English"),
  planningCountry("BE", "Belgium", "Europe", "EUR", "Dutch"),
  planningCountry("LU", "Luxembourg", "Europe", "EUR", "French"),
  planningCountry("MT", "Malta", "Europe", "EUR", "English"),
  planningCountry("AT", "Austria", "Europe", "EUR", "German"),
  planningCountry("CH", "Switzerland", "Europe", "CHF", "German"),
  planningCountry("DK", "Denmark", "Europe", "DKK", "Danish"),
  planningCountry("SE", "Sweden", "Europe", "SEK", "Swedish"),
  planningCountry("NO", "Norway", "Europe", "NOK", "Norwegian"),
  planningCountry("FI", "Finland", "Europe", "EUR", "Finnish"),
  planningCountry("IS", "Iceland", "Europe", "ISK", "Icelandic"),
  planningCountry("LI", "Liechtenstein", "Europe", "CHF", "German"),
  planningCountry("MC", "Monaco", "Europe", "EUR", "French"),
  planningCountry("AD", "Andorra", "Europe", "EUR", "Catalan"),
  planningCountry("SM", "San Marino", "Europe", "EUR", "Italian"),

  // Central Europe (owner-approved wave 4)
  planningCountry("HU", "Hungary", "Europe", "HUF", "Hungarian"),
  planningCountry("SI", "Slovenia", "Europe", "EUR", "Slovenian"),

  // Middle East (owner-approved wave 4)
  planningCountry("TR", "Turkey", "Middle East", "TRY", "Turkish"),

  // Asia, fiscally sound (owner-approved wave 4)
  planningCountry("TW", "Taiwan", "Asia", "TWD", "Chinese"),
  planningCountry("HK", "Hong Kong", "Asia", "HKD", "Chinese"),
  planningCountry("BN", "Brunei", "Asia", "BND", "Malay"),

  // Eastern Europe (owner-approved wave 5)
  planningCountry("HR", "Croatia", "Europe", "EUR", "Croatian"),
  planningCountry("GR", "Greece", "Europe", "EUR", "Greek"),
  planningCountry("CY", "Cyprus", "Europe", "EUR", "Greek"),
  planningCountry("RS", "Serbia", "Europe", "RSD", "Serbian"),
  planningCountry("BA", "Bosnia and Herzegovina", "Europe", "BAM", "Bosnian"),
  planningCountry("ME", "Montenegro", "Europe", "EUR", "Montenegrin"),
  planningCountry("MK", "North Macedonia", "Europe", "MKD", "Macedonian"),
  planningCountry("AL", "Albania", "Europe", "ALL", "Albanian"),
  planningCountry("XK", "Kosovo", "Europe", "EUR", "Albanian"),
  planningCountry("MD", "Moldova", "Europe", "MDL", "Romanian"),
  planningCountry("UA", "Ukraine", "Europe", "UAH", "Ukrainian"),
  planningCountry("GE", "Georgia", "Europe", "GEL", "Georgian"),
  planningCountry("AM", "Armenia", "Europe", "AMD", "Armenian"),
  planningCountry("AZ", "Azerbaijan", "Europe", "AZN", "Azerbaijani"),

  // Asia, expansion (owner-approved wave 5)
  planningCountry("NP", "Nepal", "Asia", "NPR", "Nepali"),
  planningCountry("KH", "Cambodia", "Asia", "KHR", "Khmer"),
  planningCountry("MN", "Mongolia", "Asia", "MNT", "Mongolian"),
  planningCountry("KZ", "Kazakhstan", "Asia", "KZT", "Kazakh"),
];
