import { countryCatalog } from "./country-catalog";
import {
  getCountryLaunchAssessment,
  getGlobalRolloutSnapshot,
} from "./country-readiness-registry";

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

/** Countries present in configuration and enabled for development/runtime use. */
export function getEnabledCountries() {
  return countryCatalog.filter((country) => country.enabled);
}

export function getDisabledCountries() {
  return countryCatalog.filter((country) => !country.enabled);
}

export function getCountryByISO(isoCode: string) {
  const normalized = normalizeISO(isoCode);
  return countryCatalog.find((country) => country.isoCode === normalized);
}

export function getCountriesForFeature(feature: CountryFeature) {
  return countryCatalog.filter((country) => country.enabled && country[feature]);
}

export function isCountryFeatureEnabled(isoCode: string, feature: CountryFeature) {
  const country = getCountryByISO(isoCode);
  return Boolean(country?.enabled && country[feature]);
}

/** Countries that have passed every launch-readiness dimension and are beta/live. */
export function getLaunchReadyCountries() {
  const ready = new Set(
    getGlobalRolloutSnapshot()
      .filter((country) => country.launchReady)
      .map((country) => country.isoCode),
  );
  return countryCatalog.filter((country) => ready.has(country.isoCode));
}

/** Launch-ready countries whose payment configuration is also commercially enabled. */
export function getCommercialReadyCountries() {
  const ready = new Set(
    getGlobalRolloutSnapshot()
      .filter((country) => country.commercialReady)
      .map((country) => country.isoCode),
  );
  return countryCatalog.filter((country) => ready.has(country.isoCode));
}

export function isCountryLaunchReady(isoCode: string) {
  return Boolean(getCountryLaunchAssessment(normalizeISO(isoCode))?.launchReady);
}

export function isCountryCommercialReady(isoCode: string) {
  return Boolean(getCountryLaunchAssessment(normalizeISO(isoCode))?.commercialReady);
}
