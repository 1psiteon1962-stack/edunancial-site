import { countryCatalog } from "./country-catalog";
import {
  assessCountryLaunchReadiness,
  type CountryLaunchAssessment,
  type CountryReadiness,
} from "./country-readiness";

export interface CountryReadinessProfile {
  isoCode: string;
  readiness: CountryReadiness;
  notes?: Partial<Record<keyof CountryReadiness, string>>;
  updatedAt?: string;
}

const NOT_READY: CountryReadiness = {
  translations: false,
  legal: false,
  payments: false,
  tax: false,
  privacy: false,
  content: false,
  support: false,
};

const READY: CountryReadiness = {
  translations: true,
  legal: true,
  payments: true,
  tax: true,
  privacy: true,
  content: true,
  support: true,
};

/**
 * Explicit rollout-readiness records.
 *
 * Fail closed by default: countries not listed here inherit NOT_READY even if
 * they exist in the country catalog. This prevents adding a country record or
 * enabling a feature flag from accidentally making that market launch-ready.
 */
export const countryReadinessProfiles: CountryReadinessProfile[] = [
  {
    isoCode: "US",
    readiness: READY,
    notes: {
      translations: "Primary US English experience available.",
      payments: "US production payments enabled; continue operational monitoring.",
      content: "Canonical curriculum available; localized lesson coverage is tracked separately.",
    },
  },
  {
    isoCode: "CA",
    readiness: {
      ...READY,
      translations: false,
      legal: false,
      tax: false,
      support: false,
    },
    notes: {
      translations: "English/Canadian French experience must be launch-verified end to end.",
      legal: "Canadian terms/commercial disclosures require final launch review.",
      tax: "GST/HST/PST/QST operational configuration and filing readiness must be verified.",
      support: "Country-specific support readiness has not been certified.",
    },
  },
];

const readinessByIso = new Map(
  countryReadinessProfiles.map((profile) => [profile.isoCode.toUpperCase(), profile]),
);

export function getCountryReadinessProfile(isoCode: string): CountryReadinessProfile {
  const normalized = isoCode.trim().toUpperCase();
  return readinessByIso.get(normalized) ?? {
    isoCode: normalized,
    readiness: { ...NOT_READY },
  };
}

export function getCountryLaunchAssessment(isoCode: string): CountryLaunchAssessment | null {
  const normalized = isoCode.trim().toUpperCase();
  const country = countryCatalog.find((entry) => entry.isoCode.toUpperCase() === normalized);
  if (!country) return null;
  return assessCountryLaunchReadiness(country, getCountryReadinessProfile(normalized).readiness);
}

export function getGlobalRolloutSnapshot() {
  return countryCatalog.map((country) => {
    const profile = getCountryReadinessProfile(country.isoCode);
    const assessment = assessCountryLaunchReadiness(country, profile.readiness);
    return {
      isoCode: country.isoCode,
      country: country.country,
      continent: country.continent,
      status: country.status,
      enabled: country.enabled,
      currency: country.currency,
      language: country.language,
      launchReady: assessment.launchReady,
      commercialReady: assessment.commercialReady,
      missing: assessment.missing,
      readiness: profile.readiness,
      notes: profile.notes ?? {},
    };
  });
}
