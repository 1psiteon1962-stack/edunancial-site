"use client";

import {
  createContext,
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
  detectInitialInternationalPreferences,
  dismissInternationalBanner,
  isInternationalBannerDismissed,
  loadInternationalPreferences,
  saveInternationalPreferences,
  type InternationalPreferences,
} from "@/lib/international/preferences";
import { resolveAvailablePaymentMethods } from "@/lib/international/preference-architecture";

type InternationalPreferencesContextValue = {
  ready: boolean;
  preferences: InternationalPreferences;
  showDetectionBanner: boolean;
  setLanguage: (language: string) => void;
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

const defaultPreferences = detectInitialInternationalPreferences();

const InternationalPreferencesContext = createContext<InternationalPreferencesContextValue>({
  ready: false,
  preferences: defaultPreferences,
  showDetectionBanner: false,
  setLanguage: () => {},
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
  children,
}: {
  children: ReactNode;
}) {
  const [preferences, setPreferences] = useState<InternationalPreferences>(defaultPreferences);
  const [showDetectionBanner, setShowDetectionBanner] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = loadInternationalPreferences();

    if (stored) {
      setPreferences(stored);
      setShowDetectionBanner(false);
      setReady(true);
      return;
    }

    const detected = detectInitialInternationalPreferences();

    setPreferences(detected);
    saveInternationalPreferences(detected);
    setShowDetectionBanner(!isInternationalBannerDismissed());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    saveInternationalPreferences(preferences);

    document.documentElement.lang = normalizeLanguageCode(preferences.preferredLanguage);
    document.documentElement.dir = isRtlLanguage(preferences.preferredLanguage) ? "rtl" : "ltr";
  }, [preferences, ready]);

  const contextValue = useMemo<InternationalPreferencesContextValue>(() => {
    return {
      ready,
      preferences,
      showDetectionBanner,
      setLanguage: (language) => {
        const normalizedLanguage = normalizeLanguageCode(language);
        setPreferences((previous) => ({
          ...previous,
          preferredLanguage: normalizedLanguage,
          languageSelectionSource: "user-confirmed",
        }));
      },
      setCountry: (country) => {
        setPreferences((previous) => ({
          ...previous,
          country,
        }));
      },
      setRegion: (region) => {
        setPreferences((previous) => ({
          ...previous,
          ...(function () {
            const availablePaymentMethods = resolveAvailablePaymentMethods(region, previous.country);
            return {
              region,
              preferredPaymentMethod: (availablePaymentMethods as readonly string[]).includes(
                previous.preferredPaymentMethod
              )
                ? previous.preferredPaymentMethod
                : availablePaymentMethods[0],
            };
          })(),
        }));
      },
      setCurrency: (currency) => {
        setPreferences((previous) => ({
          ...previous,
          preferredCurrency: currency,
        }));
      },
      setTimezone: (timezone) => {
        setPreferences((previous) => ({
          ...previous,
          timeZone: timezone,
        }));
      },
      setDateFormat: (dateFormat) => {
        setPreferences((previous) => ({
          ...previous,
          dateFormat,
        }));
      },
      setNumberFormat: (numberFormat) => {
        setPreferences((previous) => ({
          ...previous,
          numberFormat,
        }));
      },
      setMeasurementSystem: (measurementSystem) => {
        setPreferences((previous) => ({
          ...previous,
          measurementSystem,
        }));
      },
      setPreferredPaymentMethod: (preferredPaymentMethod) => {
        setPreferences((previous) => ({
          ...previous,
          preferredPaymentMethod,
        }));
      },
      dismissDetectionBanner: () => {
        setShowDetectionBanner(false);
        dismissInternationalBanner();
      },
      t: (key, values) => {
        const adminSettings = getStoredLanguageAdminSettings();
        const isEnabled = adminSettings.enabledLanguages.includes(preferences.preferredLanguage);

        const languageToUse = isEnabled
          ? preferences.preferredLanguage
          : adminSettings.fallbackLanguage;

        return translate(languageToUse, key, values);
      },
    };
  }, [preferences, ready, showDetectionBanner]);

  return (
    <InternationalPreferencesContext.Provider value={contextValue}>
      {children}
    </InternationalPreferencesContext.Provider>
  );
}

export function useInternationalPreferences() {
  return useContext(InternationalPreferencesContext);
}
