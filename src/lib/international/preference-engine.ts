import {
  GLOBAL_FALLBACK,
  getCountryConfig,
  getRegionConfig,
  getRegionForCountry,
  resolveCurrencyForCountry,
  resolveLanguageForRegion,
  type RegionId,
} from "./global-regional-architecture.ts";

export interface StoredRegionalPreference {
  region?: string;
  country?: string;
  language?: string;
  currency?: string;
}

export interface UrlRegionalContext {
  region?: string;
  language?: string;
}

export interface GeoDetectionSignal {
  country?: string;
  region?: string;
  enabled?: boolean;
}

export interface PreferenceResolutionInput {
  explicitSelection?: StoredRegionalPreference;
  memberPreference?: StoredRegionalPreference;
  cookiePreference?: StoredRegionalPreference;
  urlContext?: UrlRegionalContext;
  countrySelection?: string;
  browserLanguages?: string[];
  geoDetection?: GeoDetectionSignal;
}

export interface ResolvedRegionalPreference {
  region: RegionId;
  country: string;
  language: string;
  currency: string;
  source: {
    region: string;
    country: string;
    language: string;
    currency: string;
  };
  redirectRequired: boolean;
}

function resolveRegion(input: PreferenceResolutionInput): { region: RegionId; source: string } {
  const explicitRegion = input.explicitSelection?.region;
  if (explicitRegion && getRegionConfig(explicitRegion).id) {
    return { region: getRegionConfig(explicitRegion).id, source: "explicit-user-selection" };
  }

  const memberRegion = input.memberPreference?.region;
  if (memberRegion && getRegionConfig(memberRegion).id) {
    return { region: getRegionConfig(memberRegion).id, source: "authenticated-member-preference" };
  }

  const cookieRegion = input.cookiePreference?.region;
  if (cookieRegion && getRegionConfig(cookieRegion).id) {
    return { region: getRegionConfig(cookieRegion).id, source: "anonymous-cookie-preference" };
  }

  const urlRegion = input.urlContext?.region;
  if (urlRegion && getRegionConfig(urlRegion).id) {
    return { region: getRegionConfig(urlRegion).id, source: "url-context" };
  }

  const selectedCountry = input.countrySelection;
  if (selectedCountry && getCountryConfig(selectedCountry)) {
    return { region: getRegionForCountry(selectedCountry), source: "country-selection" };
  }

  const browserRegion = detectRegionFromBrowserLanguage(input.browserLanguages);
  if (browserRegion) {
    return { region: browserRegion, source: "browser-language" };
  }

  if (input.geoDetection?.enabled) {
    if (input.geoDetection.country && getCountryConfig(input.geoDetection.country)) {
      return {
        region: getRegionForCountry(input.geoDetection.country),
        source: "geo-detection-country",
      };
    }

    if (input.geoDetection.region && getRegionConfig(input.geoDetection.region).id) {
      return { region: getRegionConfig(input.geoDetection.region).id, source: "geo-detection-region" };
    }
  }

  return { region: GLOBAL_FALLBACK.region, source: "region-default" };
}

function resolveCountry(
  region: RegionId,
  input: PreferenceResolutionInput
): { country: string; source: string } {
  const candidates = [
    { source: "explicit-user-selection", country: input.explicitSelection?.country },
    { source: "authenticated-member-preference", country: input.memberPreference?.country },
    { source: "anonymous-cookie-preference", country: input.cookiePreference?.country },
    { source: "country-selection", country: input.countrySelection },
    { source: "geo-detection-country", country: input.geoDetection?.enabled ? input.geoDetection.country : undefined },
  ];

  for (const candidate of candidates) {
    if (!candidate.country) {
      continue;
    }

    const config = getCountryConfig(candidate.country);
    if (config && config.region === region && config.enabled) {
      return { country: config.isoCode, source: candidate.source };
    }
  }

  return { country: getRegionConfig(region).defaultCountry, source: "region-default" };
}

function resolveLanguage(
  region: RegionId,
  input: PreferenceResolutionInput
): { language: string; source: string } {
  const candidates = [
    { source: "explicit-user-selection", language: input.explicitSelection?.language },
    { source: "authenticated-member-preference", language: input.memberPreference?.language },
    { source: "anonymous-cookie-preference", language: input.cookiePreference?.language },
    { source: "url-context", language: input.urlContext?.language },
    { source: "browser-language", language: input.browserLanguages?.[0] },
  ];

  for (const candidate of candidates) {
    if (!candidate.language) {
      continue;
    }

    const resolved = resolveLanguageForRegion(candidate.language, region);
    if (resolved) {
      return { language: resolved, source: candidate.source };
    }
  }

  return {
    language: resolveLanguageForRegion(undefined, region),
    source: "region-default",
  };
}

function resolveCurrency(
  region: RegionId,
  country: string,
  input: PreferenceResolutionInput
): { currency: string; source: string } {
  const candidates = [
    { source: "explicit-user-selection", currency: input.explicitSelection?.currency },
    { source: "authenticated-member-preference", currency: input.memberPreference?.currency },
    { source: "anonymous-cookie-preference", currency: input.cookiePreference?.currency },
  ];

  const regionCurrencies = new Set(getRegionConfig(region).currencies);

  for (const candidate of candidates) {
    if (candidate.currency && regionCurrencies.has(candidate.currency)) {
      return { currency: candidate.currency, source: candidate.source };
    }
  }

  const countryConfig = getCountryConfig(country);
  if (countryConfig && regionCurrencies.has(countryConfig.defaultCurrency)) {
    return { currency: countryConfig.defaultCurrency, source: "country-selection" };
  }

  return { currency: resolveCurrencyForCountry(country), source: "region-default" };
}

function detectRegionFromBrowserLanguage(browserLanguages?: string[]): RegionId | null {
  const language = browserLanguages?.[0]?.toLowerCase();
  if (!language) {
    return null;
  }

  if (language.endsWith("-us") || language.endsWith("-ca")) {
    return "north-america";
  }

  if (language.endsWith("-mx") || language.endsWith("-ar") || language.endsWith("-cl")) {
    return "latin-america";
  }

  if (language.endsWith("-fr") || language.endsWith("-de") || language.endsWith("-it")) {
    return "europe";
  }

  if (language.endsWith("-jp") || language.endsWith("-kr") || language.endsWith("-cn")) {
    return "asia";
  }

  return null;
}

export function resolveRegionalPreference(
  input: PreferenceResolutionInput = {}
): ResolvedRegionalPreference {
  const regionResolution = resolveRegion(input);
  const countryResolution = resolveCountry(regionResolution.region, input);
  const languageResolution = resolveLanguage(regionResolution.region, input);
  const currencyResolution = resolveCurrency(regionResolution.region, countryResolution.country, input);

  const regionConfig = getRegionConfig(regionResolution.region);
  const redirectRequired = Boolean(
    input.urlContext?.region &&
      input.urlContext.region !== regionConfig.id &&
      regionConfig.enabled &&
      regionConfig.status === "active"
  );

  return {
    region: regionConfig.id,
    country: countryResolution.country,
    language: languageResolution.language,
    currency: currencyResolution.currency,
    source: {
      region: regionResolution.source,
      country: countryResolution.source,
      language: languageResolution.source,
      currency: currencyResolution.source,
    },
    redirectRequired,
  };
}

const COOKIE_KEY = "edunancial_global_pref";

export function encodeRegionalPreferenceCookie(input: StoredRegionalPreference): string {
  return encodeURIComponent(JSON.stringify(input));
}

export function decodeRegionalPreferenceCookie(raw: string | null | undefined): StoredRegionalPreference | null {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(raw)) as StoredRegionalPreference;
  } catch {
    return null;
  }
}

export function buildRegionalPreferenceCookie(input: StoredRegionalPreference): string {
  const encoded = encodeRegionalPreferenceCookie(input);
  return `${COOKIE_KEY}=${encoded}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function getRegionalPreferenceCookieKey(): string {
  return COOKIE_KEY;
}
