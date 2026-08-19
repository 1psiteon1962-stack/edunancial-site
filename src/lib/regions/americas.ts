import type { RegionLaunchState } from "./architecture";

export type AmericasSubregion = "central-america" | "south-america" | "caribbean";

export interface AmericasCountryConfig {
  countryCode: string;
  name: string;
  subregion: AmericasSubregion;
  currency: string;
  languages: string[];
  launchState: RegionLaunchState;
  taxModel: "vat" | "gst" | "sales-tax" | "consumption-tax" | "custom";
  taxRegistrationRequired: boolean;
  notes?: string;
}

// Architecture registry only. Rates, thresholds and taxability must be stored as
// dated jurisdiction rules and verified before a country is activated.
export const AMERICAS_EXPANSION_COUNTRIES: AmericasCountryConfig[] = [
  { countryCode: "BZ", name: "Belize", subregion: "central-america", currency: "BZD", languages: ["en", "es"], launchState: "PRIVATE", taxModel: "gst", taxRegistrationRequired: true },
  { countryCode: "CR", name: "Costa Rica", subregion: "central-america", currency: "CRC", languages: ["es", "en"], launchState: "PRIVATE", taxModel: "vat", taxRegistrationRequired: true },
  { countryCode: "SV", name: "El Salvador", subregion: "central-america", currency: "USD", languages: ["es"], launchState: "PRIVATE", taxModel: "vat", taxRegistrationRequired: true },
  { countryCode: "GT", name: "Guatemala", subregion: "central-america", currency: "GTQ", languages: ["es"], launchState: "PRIVATE", taxModel: "vat", taxRegistrationRequired: true },
  { countryCode: "HN", name: "Honduras", subregion: "central-america", currency: "HNL", languages: ["es"], launchState: "PRIVATE", taxModel: "sales-tax", taxRegistrationRequired: true },
  { countryCode: "NI", name: "Nicaragua", subregion: "central-america", currency: "NIO", languages: ["es"], launchState: "PRIVATE", taxModel: "vat", taxRegistrationRequired: true },
  { countryCode: "PA", name: "Panama", subregion: "central-america", currency: "PAB", languages: ["es", "en"], launchState: "PRIVATE", taxModel: "consumption-tax", taxRegistrationRequired: true },

  { countryCode: "AR", name: "Argentina", subregion: "south-america", currency: "ARS", languages: ["es"], launchState: "PRIVATE", taxModel: "vat", taxRegistrationRequired: true },
  { countryCode: "BO", name: "Bolivia", subregion: "south-america", currency: "BOB", languages: ["es"], launchState: "PRIVATE", taxModel: "vat", taxRegistrationRequired: true },
  { countryCode: "BR", name: "Brazil", subregion: "south-america", currency: "BRL", languages: ["pt"], launchState: "PRIVATE", taxModel: "custom", taxRegistrationRequired: true, notes: "Model federal/state/municipal indirect taxes through versioned rules." },
  { countryCode: "CL", name: "Chile", subregion: "south-america", currency: "CLP", languages: ["es"], launchState: "PRIVATE", taxModel: "vat", taxRegistrationRequired: true },
  { countryCode: "CO", name: "Colombia", subregion: "south-america", currency: "COP", languages: ["es"], launchState: "PRIVATE", taxModel: "vat", taxRegistrationRequired: true },
  { countryCode: "EC", name: "Ecuador", subregion: "south-america", currency: "USD", languages: ["es"], launchState: "PRIVATE", taxModel: "vat", taxRegistrationRequired: true },
  { countryCode: "GY", name: "Guyana", subregion: "south-america", currency: "GYD", languages: ["en"], launchState: "PRIVATE", taxModel: "vat", taxRegistrationRequired: true },
  { countryCode: "PY", name: "Paraguay", subregion: "south-america", currency: "PYG", languages: ["es"], launchState: "PRIVATE", taxModel: "vat", taxRegistrationRequired: true },
  { countryCode: "PE", name: "Peru", subregion: "south-america", currency: "PEN", languages: ["es"], launchState: "PRIVATE", taxModel: "vat", taxRegistrationRequired: true },
  { countryCode: "SR", name: "Suriname", subregion: "south-america", currency: "SRD", languages: ["nl"], launchState: "PRIVATE", taxModel: "vat", taxRegistrationRequired: true },
  { countryCode: "UY", name: "Uruguay", subregion: "south-america", currency: "UYU", languages: ["es"], launchState: "PRIVATE", taxModel: "vat", taxRegistrationRequired: true },
  { countryCode: "VE", name: "Venezuela", subregion: "south-america", currency: "VES", languages: ["es"], launchState: "PRIVATE", taxModel: "vat", taxRegistrationRequired: true },

  { countryCode: "BS", name: "Bahamas", subregion: "caribbean", currency: "BSD", languages: ["en"], launchState: "PRIVATE", taxModel: "vat", taxRegistrationRequired: true },
  { countryCode: "BB", name: "Barbados", subregion: "caribbean", currency: "BBD", languages: ["en"], launchState: "PRIVATE", taxModel: "vat", taxRegistrationRequired: true },
  { countryCode: "DO", name: "Dominican Republic", subregion: "caribbean", currency: "DOP", languages: ["es"], launchState: "PRIVATE", taxModel: "custom", taxRegistrationRequired: true },
  { countryCode: "HT", name: "Haiti", subregion: "caribbean", currency: "HTG", languages: ["fr", "ht"], launchState: "PRIVATE", taxModel: "custom", taxRegistrationRequired: true },
  { countryCode: "JM", name: "Jamaica", subregion: "caribbean", currency: "JMD", languages: ["en"], launchState: "PRIVATE", taxModel: "gst", taxRegistrationRequired: true },
  { countryCode: "TT", name: "Trinidad and Tobago", subregion: "caribbean", currency: "TTD", languages: ["en"], launchState: "PRIVATE", taxModel: "vat", taxRegistrationRequired: true },
];

export function getAmericasCountries(subregion?: AmericasSubregion): AmericasCountryConfig[] {
  return subregion ? AMERICAS_EXPANSION_COUNTRIES.filter((country) => country.subregion === subregion) : [...AMERICAS_EXPANSION_COUNTRIES];
}
