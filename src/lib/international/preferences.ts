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

// ---------------------------------------------------------------------------
// Language preference storage keys
// ---------------------------------------------------------------------------

/** sessionStorage key for the current-session language override. */
export const SESSION_LANGUAGE_KEY = "edunancial.locale.session";

/** localStorage key for the saved default language preference. */
export const SAVED_LANGUAGE_KEY = "edunancial.locale.saved";

/**
 * Cookie name for the saved default language.
 * Written when the user saves a default so that the server-rendered HTML
 * can include the correct `lang` attribute before JavaScript loads.
 */
export const LANGUAGE_COOKIE_NAME = "edunancial-lang";

// ---------------------------------------------------------------------------
// Session-only language override (sessionStorage)
// ---------------------------------------------------------------------------

/** Returns the session-only language override, or `null` if none is set. */
export function loadSessionLanguageOverride(): string | null {
  if (!isClient()) return null;
  return sessionStorage.getItem(SESSION_LANGUAGE_KEY);
}

/** Stores a session-only language override in sessionStorage AND as a session
 *  cookie so that server-rendered pages (e.g. curriculum, course pages) also
 *  see the change without requiring a full page reload. */
export function saveSessionLanguageOverride(locale: string): void {
  if (!isClient()) return;
  sessionStorage.setItem(SESSION_LANGUAGE_KEY, locale);
  // Session cookie (no max-age) so it expires when the browser tab closes.
  document.cookie = `${LANGUAGE_COOKIE_NAME}=${encodeURIComponent(locale)}; path=/; SameSite=Lax`;
}

/** Removes the session-only language override from sessionStorage and clears
 *  the session cookie so server-rendered pages revert to the saved default. */
export function clearSessionLanguageOverride(): void {
  if (!isClient()) return;
  sessionStorage.removeItem(SESSION_LANGUAGE_KEY);
  // Remove only if there is no saved default that should replace it.
  const saved = localStorage.getItem(SAVED_LANGUAGE_KEY);
  if (saved) {
    document.cookie = `${LANGUAGE_COOKIE_NAME}=${encodeURIComponent(saved)}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
  } else {
    document.cookie = `${LANGUAGE_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  }
}

// ---------------------------------------------------------------------------
// Saved default language preference (localStorage + cookie)
// ---------------------------------------------------------------------------

/** Returns the saved default language preference, or `null` if none is set. */
export function loadSavedLanguagePreference(): string | null {
  if (!isClient()) return null;
  return localStorage.getItem(SAVED_LANGUAGE_KEY);
}

/**
 * Persists the user's chosen default language in localStorage and as a
 * cookie so server-rendered pages can use the correct `lang` attribute.
 */
export function saveSavedLanguagePreference(locale: string): void {
  if (!isClient()) return;
  localStorage.setItem(SAVED_LANGUAGE_KEY, locale);
  document.cookie = `${LANGUAGE_COOKIE_NAME}=${encodeURIComponent(locale)}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
}

/**
 * Removes the saved default language preference, restoring automatic
 * language detection on the next visit.
 */
export function clearSavedLanguagePreference(): void {
  if (!isClient()) return;
  localStorage.removeItem(SAVED_LANGUAGE_KEY);
  document.cookie = `${LANGUAGE_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

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
