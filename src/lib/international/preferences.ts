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
  buildRegionalPreferenceCookie,
  decodeRegionalPreferenceCookie,
  getRegionalPreferenceCookieKey,
  resolveRegionalPreference,
  type StoredRegionalPreference,
} from "./preference-engine";
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
export const INTERNATIONAL_PREFERENCES_COOKIE_KEY = getRegionalPreferenceCookieKey();

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

function parseCookieValue(key: string): string | null {
  if (!isClient()) {
    return null;
  }

  const cookie = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${key}=`));

  if (!cookie) {
    return null;
  }

  return cookie.slice(key.length + 1);
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

  const storagePreference = parseStoredPreferences(
    localStorage.getItem(INTERNATIONAL_PREFERENCES_STORAGE_KEY)
  );
  if (storagePreference) {
    return storagePreference;
  }

  const cookiePreference = decodeRegionalPreferenceCookie(
    parseCookieValue(INTERNATIONAL_PREFERENCES_COOKIE_KEY)
  );
  if (!cookiePreference) {
    return null;
  }

  const resolved = resolveRegionalPreference({
    cookiePreference,
  });

  return {
    preferredLanguage: normalizeLanguageCode(resolved.language),
    preferredCurrency: resolved.currency,
    country: resolved.country.toLowerCase(),
    region: resolved.region,
    timeZone: getDefaultTimezone(),
    dateFormat: resolveDateFormat(resolved.country),
    numberFormat: resolveNumberFormat(resolved.country),
    measurementSystem: resolveMeasurementSystem(resolved.country),
    preferredPaymentMethod: resolveDefaultPaymentMethod(
      resolved.region,
      resolved.country.toLowerCase()
    ),
    languageSelectionSource: resolveLanguageSource("user-confirmed"),
  };
}

export function saveInternationalPreferences(preferences: InternationalPreferences) {
  if (!isClient()) {
    return;
  }

  const user = currentUser();
  const encoded = JSON.stringify(preferences);

  localStorage.setItem(INTERNATIONAL_PREFERENCES_STORAGE_KEY, encoded);
  document.cookie = buildRegionalPreferenceCookie({
    language: preferences.preferredLanguage,
    currency: preferences.preferredCurrency,
    country: preferences.country.toUpperCase(),
    region: preferences.region,
  } satisfies StoredRegionalPreference);

  if (user?.id) {
    localStorage.setItem(getUserScopedKey(user.id), encoded);
  }
}

export function detectInitialInternationalPreferences() {
  const browserLanguage =
    typeof navigator !== "undefined" ? navigator.language : DEFAULT_LANGUAGE_CODE;
  const timezone = isClient() ? getDefaultTimezone() : "America/New_York";
  const country = parseCountryCodeFromLanguageTag(browserLanguage);
  const region = resolveRegion(country, timezone);
  const cookiePreference = decodeRegionalPreferenceCookie(
    parseCookieValue(INTERNATIONAL_PREFERENCES_COOKIE_KEY)
  );
  const resolved = resolveRegionalPreference({
    cookiePreference: cookiePreference ?? undefined,
    browserLanguages: [browserLanguage],
    countrySelection: country.toUpperCase(),
    geoDetection: {
      enabled: true,
      country: country.toUpperCase(),
      region,
    },
  });
  const preferredLanguage = resolveLanguage(resolved.language);

  return {
    preferredLanguage,
    preferredCurrency: resolved.currency ?? resolveCurrency(country, region),
    country: resolved.country.toLowerCase(),
    region: resolved.region,
    timeZone: timezone,
    dateFormat: resolveDateFormat(resolved.country),
    numberFormat: resolveNumberFormat(resolved.country),
    measurementSystem: resolveMeasurementSystem(resolved.country),
    preferredPaymentMethod: resolveDefaultPaymentMethod(
      resolved.region,
      resolved.country.toLowerCase()
    ),
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
