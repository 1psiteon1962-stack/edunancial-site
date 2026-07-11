import { paymentProviders } from "@/lib/payments/providers";
import { defaultCountryCode, globalRolloutConfig } from "@/lib/global-rollout/config";
import type {
  ComplianceProfile,
  CountryRolloutDefinition,
  CourseId,
  CurrencyDefinition,
  LanguageDefinition,
  ProductId,
  RegionDefinition,
  RolloutFeature,
} from "@/types/global-rollout";

export const GLOBAL_ROLLOUT_STORAGE_KEYS = {
  country: "edunancial-active-country",
  language: "edunancial-active-language",
  currency: "edunancial-active-currency",
} as const;

function normalizeCountryCode(countryCode?: string): string | undefined {
  if (!countryCode) {
    return undefined;
  }

  return countryCode.trim().toUpperCase();
}

function getStorageValue(key: (typeof GLOBAL_ROLLOUT_STORAGE_KEYS)[keyof typeof GLOBAL_ROLLOUT_STORAGE_KEYS]) {
  if (typeof window === "undefined") {
    return undefined;
  }

  const value = window.localStorage.getItem(key);
  return value && value.trim() !== "" ? value : undefined;
}

export function getCountryByCode(countryCode?: string): CountryRolloutDefinition | undefined {
  const normalized = normalizeCountryCode(countryCode);

  if (!normalized) {
    return undefined;
  }

  const exactMatch = globalRolloutConfig.countries.find((country) => country.code === normalized);

  if (exactMatch) {
    return exactMatch;
  }

  const baseCountryCode = normalized.split("-")[0];
  return globalRolloutConfig.countries.find((country) => country.code === baseCountryCode);
}

export function getDefaultCountry(): CountryRolloutDefinition {
  return (
    getCountryByCode(defaultCountryCode) ??
    globalRolloutConfig.countries[0]
  );
}

export function getLaunchMarketCountries(): CountryRolloutDefinition[] {
  return globalRolloutConfig.countries.filter((country) => country.enabled);
}

export function getActiveCountry(countryCode?: string): CountryRolloutDefinition {
  const storedCountry = getStorageValue(GLOBAL_ROLLOUT_STORAGE_KEYS.country);
  return getCountryByCode(countryCode) ?? getCountryByCode(storedCountry) ?? getDefaultCountry();
}

export function getActiveRegion(countryCode?: string): RegionDefinition {
  const country = getActiveCountry(countryCode);

  return (
    globalRolloutConfig.regions.find((region) => region.code === country.regionCode) ??
    globalRolloutConfig.regions[0]
  );
}

export function isFeatureEnabled(feature: RolloutFeature, countryCode?: string): boolean {
  const country = getActiveCountry(countryCode);
  return country.enabled && country.featureAvailability[feature];
}

export function isCourseAvailable(courseId: CourseId, countryCode?: string): boolean {
  const country = getActiveCountry(countryCode);
  return country.enabled && country.courses.includes(courseId);
}

export function isProductAvailable(productId: ProductId, countryCode?: string): boolean {
  const country = getActiveCountry(countryCode);
  return country.enabled && country.products.includes(productId);
}

export function getEnabledLanguages(countryCode?: string): LanguageDefinition[] {
  const country = getActiveCountry(countryCode);

  return globalRolloutConfig.languages.filter(
    (language) => language.enabled && country.supportedLanguages.includes(language.code)
  );
}

export function getEnabledCurrencies(countryCode?: string): CurrencyDefinition[] {
  const country = getActiveCountry(countryCode);

  return globalRolloutConfig.currencies.filter(
    (currency) => currency.enabled && country.supportedCurrencies.includes(currency.code)
  );
}

export function getComplianceProfile(countryCode?: string): ComplianceProfile {
  const normalized = normalizeCountryCode(countryCode);
  const country = getActiveCountry(countryCode);

  let complianceProfileId = country.complianceProfileId;

  if (normalized?.startsWith("CA-")) {
    const subdivision = normalized.split("-")[1];
    complianceProfileId = country.subdivisionComplianceOverrides?.[subdivision] ?? complianceProfileId;
  }

  return (
    globalRolloutConfig.complianceProfiles.find((profile) => profile.id === complianceProfileId) ??
    globalRolloutConfig.complianceProfiles[0]
  );
}

export function getPaymentProviders(countryCode?: string) {
  const country = getActiveCountry(countryCode);

  return paymentProviders.filter((provider) => country.paymentProviders.includes(provider.id));
}

export function getRegions() {
  return globalRolloutConfig.regions;
}

export function getCountries() {
  return globalRolloutConfig.countries;
}

export function getCountriesForRegion(regionCode?: string) {
  if (!regionCode) {
    return getCountries();
  }

  return globalRolloutConfig.countries.filter((country) => country.regionCode === regionCode);
}

export function getContinents() {
  return globalRolloutConfig.continents;
}

export function getLanguageCatalog() {
  return globalRolloutConfig.languages;
}

export function getCurrencyCatalog() {
  return globalRolloutConfig.currencies;
}

export function getProductCatalog() {
  return globalRolloutConfig.products;
}

export function getCourseCatalog() {
  return globalRolloutConfig.courses;
}

export function getMembershipPlanCatalog() {
  return globalRolloutConfig.membershipPlans;
}

export function getAIFeatureCatalog() {
  return globalRolloutConfig.aiFeatures;
}

export function getMarketingCampaignCatalog() {
  return globalRolloutConfig.marketingCampaigns;
}

export function getRolloutSummary() {
  return {
    enabledContinents: globalRolloutConfig.continents.filter((continent) => continent.enabled).length,
    enabledCountries: globalRolloutConfig.countries.filter((country) => country.enabled).length,
    enabledLanguages: globalRolloutConfig.languages.filter((language) => language.enabled).length,
    enabledCurrencies: globalRolloutConfig.currencies.filter((currency) => currency.enabled).length,
  };
}
