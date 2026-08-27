import { countries } from "./country-registry";

export type CountryFeature =
  | "membershipEnabled"
  | "marketplaceEnabled"
  | "paymentsEnabled"
  | "coursesEnabled"
  | "assessmentsEnabled"
  | "hiringEnabled"
  | "aiEnabled";

function normalizeISO(isoCode: string) {
  return isoCode.trim().toUpperCase();
}

export function getEnabledCountries() {
  return countries.filter((country) => country.enabled);
}

export function getDisabledCountries() {
  return countries.filter((country) => !country.enabled);
}

export function getCountryByISO(isoCode: string) {
  const normalized = normalizeISO(isoCode);
  return countries.find((country) => country.isoCode === normalized);
}

export function getCountriesForFeature(feature: CountryFeature) {
  return countries.filter((country) => country.enabled && country[feature]);
}

export function isCountryFeatureEnabled(isoCode: string, feature: CountryFeature) {
  const country = getCountryByISO(isoCode);
  return Boolean(country?.enabled && country[feature]);
}
