"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { translate } from "@/lib/international/i18n";
import {
  getStoredLanguageAdminSettings,
  isRtlLanguage,
  normalizeLanguageCode,
} from "@/lib/international/languages";
import {
  clearSavedLanguagePreference,
  clearSessionLanguageOverride,
  detectInitialInternationalPreferences,
  dismissInternationalBanner,
  isInternationalBannerDismissed,
  loadInternationalPreferences,
  loadSavedLanguagePreference,
  loadSessionLanguageOverride,
  saveInternationalPreferences,
  saveSavedLanguagePreference,
  saveSessionLanguageOverride,
  LANGUAGE_COOKIE_NAME,
  type InternationalPreferences,
} from "@/lib/international/preferences";
import { resolveAvailablePaymentMethods } from "@/lib/international/preference-architecture";

/**
 * How the active language was determined.
 * - "saved"   — user explicitly saved a default language preference.
 * - "session" — user chose a language for the current session only.
 * - "auto"    — language was detected automatically (browser / geo / fallback).
 */
export type LanguagePreferenceMode = "saved" | "session" | "auto";

type InternationalPreferencesContextValue = {
  ready: boolean;
  preferences: InternationalPreferences;
  /** Language active for this session (may differ from persisted preferences.preferredLanguage). */
  effectiveLanguage: string;
  /** How the current language was determined. */
  languagePreferenceMode: LanguagePreferenceMode;
  /** True while awaiting the user's choice for how to apply a language change. */
  languagePromptPending: boolean;
  showDetectionBanner: boolean;
  /**
   * Applies `language` immediately for the current session and opens the
   * persistence prompt so the user can choose session-only or saved default.
   */
  setLanguage: (language: string) => void;
  /**
   * Responds to the persistence prompt.
   * - `makeDefault: true`  — persist as the user's saved default language.
   * - `makeDefault: false` — keep as a session-only override.
   */
  confirmLanguageDefault: (makeDefault: boolean) => void;
  /**
   * Clears all language overrides (saved default + session) and re-detects
   * the appropriate language automatically.
   */
  resetToAutomatic: () => void;
  setCountry: (country: string) => void;
  setRegion: (region: string) => void;
  setCurrency: (currency: string) => void;
  setTimezone: (timezone: string) => void;
  setDateFormat: (dateFormat: string) => void;
  setNumberFormat: (numberFormat: string) => void;
  setMeasurementSystem: (measurementSystem: "metric" | "imperial") => void;
  setPreferredPaymentMethod: (paymentMethod: string) => void;
  dismissDetectionBanner: () => void;
  t: (key: string, values?: Record<string, string | number>) => string;
};

function createDefaultPreferences(initialLanguage?: string): InternationalPreferences {
  const detected = detectInitialInternationalPreferences();

  return initialLanguage
    ? {
        ...detected,
        preferredLanguage: normalizeLanguageCode(initialLanguage),
      }
    : detected;
}

const defaultPreferences = createDefaultPreferences();

const InternationalPreferencesContext = createContext<InternationalPreferencesContextValue>({
  ready: false,
  preferences: defaultPreferences,
  effectiveLanguage: defaultPreferences.preferredLanguage,
  languagePreferenceMode: "auto",
  languagePromptPending: false,
  showDetectionBanner: false,
  setLanguage: () => {},
  confirmLanguageDefault: () => {},
  resetToAutomatic: () => {},
  setCountry: () => {},
  setRegion: () => {},
  setCurrency: () => {},
  setTimezone: () => {},
  setDateFormat: () => {},
  setNumberFormat: () => {},
  setMeasurementSystem: () => {},
  setPreferredPaymentMethod: () => {},
  dismissDetectionBanner: () => {},
  t: (key) => key,
});

export function InternationalPreferencesProvider({
  initialLanguage,
  children,
}: {
  initialLanguage?: string;
  children: ReactNode;
}) {
  const [preferences, setPreferences] = useState<InternationalPreferences>(() =>
    createDefaultPreferences(initialLanguage)
  );
  const [showDetectionBanner, setShowDetectionBanner] = useState(false);
  const [ready, setReady] = useState(false);
  /**
   * Language chosen this session.
   * Backed by sessionStorage so it survives page refreshes within the session.
   */
  const [sessionLanguage, setSessionLanguageState] = useState<string | null>(null);
  /** Whether the persistence prompt is awaiting the user's answer. */
  const [languagePromptPending, setLanguagePromptPending] = useState(false);

  // Hydrate from storage on mount.
  useEffect(() => {
    const stored = loadInternationalPreferences();
    const savedLang = loadSavedLanguagePreference();
    const sessionLang = loadSessionLanguageOverride();

    if (stored) {
      // Apply saved language preference over full stored preferences.
      const effectiveStored = savedLang
        ? { ...stored, preferredLanguage: normalizeLanguageCode(savedLang) }
        : stored;
      setPreferences(effectiveStored);
    } else {
      const detected = createDefaultPreferences(initialLanguage);
      setPreferences(detected);
      saveInternationalPreferences(detected);
    }

    if (sessionLang) {
      setSessionLanguageState(normalizeLanguageCode(sessionLang));
    }

    setShowDetectionBanner(!isInternationalBannerDismissed());
    setReady(true);
  }, []);

  // Sync document attributes whenever the effective language changes.
  useEffect(() => {
    if (!ready) return;

    saveInternationalPreferences(preferences);

    const langToApply = sessionLanguage ?? preferences.preferredLanguage;
    const normalizedLanguage = normalizeLanguageCode(langToApply);
    const isPersistentDefault =
      !sessionLanguage && preferences.languageSelectionSource === "user-confirmed";

    document.documentElement.lang = normalizedLanguage;
    document.documentElement.dir = isRtlLanguage(langToApply) ? "rtl" : "ltr";
    document.cookie = isPersistentDefault
      ? `${LANGUAGE_COOKIE_NAME}=${encodeURIComponent(normalizedLanguage)}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
      : `${LANGUAGE_COOKIE_NAME}=${encodeURIComponent(normalizedLanguage)}; path=/; SameSite=Lax`;
  }, [preferences, sessionLanguage, ready]);

  const setSessionLanguage = useCallback((lang: string | null) => {
    setSessionLanguageState(lang);
    if (lang) {
      saveSessionLanguageOverride(lang);
    } else {
      clearSessionLanguageOverride();
    }
  }, []);

  const contextValue = useMemo<InternationalPreferencesContextValue>(() => {
    const effectiveLanguage = sessionLanguage ?? preferences.preferredLanguage;

    // Determine how the active language was resolved.
    const savedLang = loadSavedLanguagePreference();
    let languagePreferenceMode: LanguagePreferenceMode = "auto";
    if (savedLang && preferences.languageSelectionSource === "user-confirmed") {
      languagePreferenceMode = "saved";
    } else if (sessionLanguage) {
      languagePreferenceMode = "session";
    }

    return {
      ready,
      preferences,
      effectiveLanguage,
      languagePreferenceMode,
      languagePromptPending,
      showDetectionBanner,
      setLanguage: (language) => {
        const normalizedLanguage = normalizeLanguageCode(language);
        // Apply language immediately for this session without persisting.
        setSessionLanguage(normalizedLanguage);
        setLanguagePromptPending(true);
      },
      confirmLanguageDefault: (makeDefault) => {
        if (makeDefault && sessionLanguage) {
          // Persist as the user's confirmed default.
          saveSavedLanguagePreference(sessionLanguage);
          setPreferences((previous) => ({
            ...previous,
            preferredLanguage: sessionLanguage,
            languageSelectionSource: "user-confirmed",
          }));
          setSessionLanguage(null);
        }
        // If not making default, sessionLanguage remains active for this session only.
        setLanguagePromptPending(false);
      },
      resetToAutomatic: () => {
        // Clear both saved and session language overrides.
        clearSavedLanguagePreference();
        setSessionLanguage(null);
        setLanguagePromptPending(false);
        // Re-detect language from browser signals.
        const detected = detectInitialInternationalPreferences();
        setPreferences((previous) => ({
          ...previous,
          preferredLanguage: detected.preferredLanguage,
          languageSelectionSource: "detected",
        }));
      },
      setCountry: (country) => {
        setPreferences((previous) => ({ ...previous, country }));
      },
      setRegion: (region) => {
        setPreferences((previous) => {
          const availablePaymentMethods = resolveAvailablePaymentMethods(region, previous.country);
          return {
            ...previous,
            region,
            preferredPaymentMethod: (availablePaymentMethods as readonly string[]).includes(
              previous.preferredPaymentMethod
            )
              ? previous.preferredPaymentMethod
              : availablePaymentMethods[0],
          };
        });
      },
      setCurrency: (currency) => {
        setPreferences((previous) => ({ ...previous, preferredCurrency: currency }));
      },
      setTimezone: (timezone) => {
        setPreferences((previous) => ({ ...previous, timeZone: timezone }));
      },
      setDateFormat: (dateFormat) => {
        setPreferences((previous) => ({ ...previous, dateFormat }));
      },
      setNumberFormat: (numberFormat) => {
        setPreferences((previous) => ({ ...previous, numberFormat }));
      },
      setMeasurementSystem: (measurementSystem) => {
        setPreferences((previous) => ({ ...previous, measurementSystem }));
      },
      setPreferredPaymentMethod: (preferredPaymentMethod) => {
        setPreferences((previous) => ({ ...previous, preferredPaymentMethod }));
      },
      dismissDetectionBanner: () => {
        setShowDetectionBanner(false);
        dismissInternationalBanner();
      },
      t: (key, values) => {
        const adminSettings = getStoredLanguageAdminSettings();
        const isEnabled = adminSettings.enabledLanguages.includes(effectiveLanguage);
        const languageToUse = isEnabled ? effectiveLanguage : adminSettings.fallbackLanguage;
        return translate(languageToUse, key, values);
      },
    };
  }, [preferences, sessionLanguage, languagePromptPending, ready, showDetectionBanner, setSessionLanguage]);

  return (
    <InternationalPreferencesContext.Provider value={contextValue}>
      {children}
    </InternationalPreferencesContext.Provider>
  );
}

export function useInternationalPreferences() {
  return useContext(InternationalPreferencesContext);
}
