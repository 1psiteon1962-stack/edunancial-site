import { countries as legacyCountries } from "./country-registry";
import { priorityExpansionCountries } from "./priority-expansion-countries";

export const countryCatalog = [...legacyCountries, ...priorityExpansionCountries];

export function getCountryCatalogDuplicateIsoCodes() {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const country of countryCatalog) {
    const isoCode = country.isoCode.trim().toUpperCase();
    if (seen.has(isoCode)) duplicates.add(isoCode);
    seen.add(isoCode);
  }
  return [...duplicates].sort();
}
