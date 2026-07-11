import { currentUser } from "../auth";
import { countries } from "../location/countries";
import { regionalSettings } from "../regionalSettings";
import {
  DEFAULT_LANGUAGE_CODE,
  getStoredLanguageAdminSettings,
  isLanguageSupported,
  normalizeLanguageCode,
} from "./languages";
import { parseCountryCodeFromLanguageTag, resolveRegion } from "./detection";

export type InternationalPreferences = {
  language: string;
  region: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  measurementSystem: "metric" | "imperial";
};

export const INTERNATIONAL_PREFERENCES_STORAGE_KEY = "edunancial:international-preferences";
export const INTERNATIONAL_BANNER_DISMISSED_STORAGE_KEY =
  "edunancial:international-banner-dismissed";

function getDefaultTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
}

function resolveCurrency(countryCode: string, region: string) {
  const byCountry = countries.find((country) => country.id === countryCode.toLowerCase());

  if (byCountry?.currency) {
    return byCountry.currency;
  }

  const byRegion = regionalSettings.find((setting) => setting.region === region);

  return byRegion?.defaultCurrency ?? "USD";
}

function resolveLanguage(browserLanguage: string, region: string) {
  const settings = getStoredLanguageAdminSettings();
  const normalizedBrowserLanguage = normalizeLanguageCode(browserLanguage);
  const regionSettings = regionalSettings.find((setting) => setting.region === region);

  if (
    settings.enabledLanguages.includes(normalizedBrowserLanguage) &&
    isLanguageSupported(normalizedBrowserLanguage)
  ) {
    return normalizedBrowserLanguage;
  }

  const regionDefaultLanguage = normalizeLanguageCode(regionSettings?.defaultLanguage);

  if (
    settings.enabledLanguages.includes(regionDefaultLanguage) &&
    isLanguageSupported(regionDefaultLanguage)
  ) {
    return regionDefaultLanguage;
  }

  if (
    settings.enabledLanguages.includes(settings.defaultLanguage) &&
    isLanguageSupported(settings.defaultLanguage)
  ) {
    return settings.defaultLanguage;
  }

  return settings.fallbackLanguage || DEFAULT_LANGUAGE_CODE;
}

function resolveDateFormat(countryCode: string) {
  return countryCode.toLowerCase() === "us" ? "MM/DD/YYYY" : "DD/MM/YYYY";
}

function resolveNumberFormat(language: string) {
  return language === "en" ? "1,234.56" : "1.234,56";
}

function resolveMeasurementSystem(countryCode: string): "metric" | "imperial" {
  return countryCode.toLowerCase() === "us" ? "imperial" : "metric";
}

function getUserScopedKey(userId: string) {
  return `${INTERNATIONAL_PREFERENCES_STORAGE_KEY}:${userId}`;
}

function isClient() {
  return typeof window !== "undefined";
}

function parseStoredPreferences(raw: string | null): InternationalPreferences | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<InternationalPreferences>;

    if (!parsed.language || !parsed.region || !parsed.currency || !parsed.timezone) {
      return null;
    }

    return {
      language: normalizeLanguageCode(parsed.language),
      region: parsed.region,
      currency: parsed.currency,
      timezone: parsed.timezone,
      dateFormat: parsed.dateFormat ?? resolveDateFormat("us"),
      numberFormat: parsed.numberFormat ?? resolveNumberFormat(parsed.language),
      measurementSystem: parsed.measurementSystem ?? "imperial",
    };
  } catch {
    return null;
  }
}

export function loadInternationalPreferences(): InternationalPreferences | null {
  if (!isClient()) {
    return null;
  }

  const user = currentUser();

  if (user?.id) {
    const userScoped = parseStoredPreferences(
      localStorage.getItem(getUserScopedKey(user.id))
    );

    if (userScoped) {
      return userScoped;
    }
  }

  return parseStoredPreferences(localStorage.getItem(INTERNATIONAL_PREFERENCES_STORAGE_KEY));
}

export function saveInternationalPreferences(preferences: InternationalPreferences) {
  if (!isClient()) {
    return;
  }

  const user = currentUser();
  const encoded = JSON.stringify(preferences);

  localStorage.setItem(INTERNATIONAL_PREFERENCES_STORAGE_KEY, encoded);

  if (user?.id) {
    localStorage.setItem(getUserScopedKey(user.id), encoded);
  }
}

export function detectInitialInternationalPreferences() {
  const browserLanguage =
    typeof navigator !== "undefined" ? navigator.language : DEFAULT_LANGUAGE_CODE;

  const timezone = isClient() ? getDefaultTimezone() : "America/New_York";
  const countryCode = parseCountryCodeFromLanguageTag(browserLanguage);
  const region = resolveRegion(countryCode, timezone);
  const language = resolveLanguage(browserLanguage, region);

  return {
    language,
    region,
    currency: resolveCurrency(countryCode, region),
    timezone,
    dateFormat: resolveDateFormat(countryCode),
    numberFormat: resolveNumberFormat(language),
    measurementSystem: resolveMeasurementSystem(countryCode),
  } satisfies InternationalPreferences;
}

export function isInternationalBannerDismissed() {
  if (!isClient()) {
    return true;
  }

  return localStorage.getItem(INTERNATIONAL_BANNER_DISMISSED_STORAGE_KEY) === "true";
}

export function dismissInternationalBanner() {
  if (!isClient()) {
    return;
  }

  localStorage.setItem(INTERNATIONAL_BANNER_DISMISSED_STORAGE_KEY, "true");
}
