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
import {
  resolveDefaultPaymentMethod,
  type GlobalUserPreferences,
  type LanguageSelectionSource,
} from "./preference-architecture";

export type InternationalPreferences = GlobalUserPreferences;

type LegacyInternationalPreferences = {
  language?: string;
  currency?: string;
  timezone?: string;
  region?: string;
  dateFormat?: string;
  numberFormat?: string;
  measurementSystem?: "metric" | "imperial";
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

function resolveLanguage(browserLanguage: string) {
  const settings = getStoredLanguageAdminSettings();
  const normalizedBrowserLanguage = normalizeLanguageCode(browserLanguage);

  if (
    settings.enabledLanguages.includes(normalizedBrowserLanguage) &&
    isLanguageSupported(normalizedBrowserLanguage)
  ) {
    return normalizedBrowserLanguage;
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

function resolveNumberFormat(countryCode: string) {
  return countryCode.toLowerCase() === "us" ? "1,234.56" : "1.234,56";
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

function resolveLanguageSource(
  input?: string
): LanguageSelectionSource {
  return input === "user-confirmed" ? "user-confirmed" : "detected";
}

function toInternationalPreferences(
  parsed: Partial<InternationalPreferences> | LegacyInternationalPreferences
): InternationalPreferences | null {
  const source = parsed as Record<string, string | undefined>;
  const rawLanguage = source.preferredLanguage ?? source.language;
  const rawCurrency = source.preferredCurrency ?? source.currency;
  const rawTimezone = source.timeZone ?? source.timezone;
  const region = source.region;

  if (!rawLanguage || !rawCurrency || !rawTimezone || !region) {
    return null;
  }

  const country = (source.country ?? parseCountryCodeFromLanguageTag(rawLanguage) ?? "us").toLowerCase();
  const preferredLanguage = normalizeLanguageCode(rawLanguage);

  return {
    preferredLanguage,
    preferredCurrency: rawCurrency,
    country,
    region,
    timeZone: rawTimezone,
    dateFormat: parsed.dateFormat ?? resolveDateFormat(country),
    numberFormat: parsed.numberFormat ?? resolveNumberFormat(country),
    measurementSystem: parsed.measurementSystem ?? resolveMeasurementSystem(country),
    preferredPaymentMethod:
      source.preferredPaymentMethod ?? resolveDefaultPaymentMethod(region, country),
    languageSelectionSource: resolveLanguageSource(source.languageSelectionSource),
  };
}

function parseStoredPreferences(raw: string | null): InternationalPreferences | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<InternationalPreferences> | LegacyInternationalPreferences;
    return toInternationalPreferences(parsed);
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
    const userScoped = parseStoredPreferences(localStorage.getItem(getUserScopedKey(user.id)));
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
  const browserLanguage = typeof navigator !== "undefined" ? navigator.language : DEFAULT_LANGUAGE_CODE;
  const timezone = isClient() ? getDefaultTimezone() : "America/New_York";
  const country = parseCountryCodeFromLanguageTag(browserLanguage);
  const region = resolveRegion(country, timezone);
  const preferredLanguage = resolveLanguage(browserLanguage);

  return {
    preferredLanguage,
    preferredCurrency: resolveCurrency(country, region),
    country,
    region,
    timeZone: timezone,
    dateFormat: resolveDateFormat(country),
    numberFormat: resolveNumberFormat(country),
    measurementSystem: resolveMeasurementSystem(country),
    preferredPaymentMethod: resolveDefaultPaymentMethod(region, country),
    languageSelectionSource: "detected",
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
