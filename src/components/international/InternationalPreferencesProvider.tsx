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

type InternationalPreferencesContextValue = {
  ready: boolean;
  preferences: InternationalPreferences;
  showDetectionBanner: boolean;
  setLanguage: (language: string) => void;
  setRegion: (region: string) => void;
  setCurrency: (currency: string) => void;
  setTimezone: (timezone: string) => void;
  setDateFormat: (dateFormat: string) => void;
  setNumberFormat: (numberFormat: string) => void;
  setMeasurementSystem: (measurementSystem: "metric" | "imperial") => void;
  dismissDetectionBanner: () => void;
  t: (key: string, values?: Record<string, string | number>) => string;
};

const defaultPreferences = detectInitialInternationalPreferences();

const InternationalPreferencesContext = createContext<InternationalPreferencesContextValue>({
  ready: false,
  preferences: defaultPreferences,
  showDetectionBanner: false,
  setLanguage: () => {},
  setRegion: () => {},
  setCurrency: () => {},
  setTimezone: () => {},
  setDateFormat: () => {},
  setNumberFormat: () => {},
  setMeasurementSystem: () => {},
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

    document.documentElement.lang = normalizeLanguageCode(preferences.language);
    document.documentElement.dir = isRtlLanguage(preferences.language) ? "rtl" : "ltr";
  }, [preferences, ready]);

  const contextValue = useMemo<InternationalPreferencesContextValue>(() => {
    return {
      ready,
      preferences,
      showDetectionBanner,
      setLanguage: (language) => {
        setPreferences((previous) => ({
          ...previous,
          language,
          numberFormat:
            language === "en"
              ? "1,234.56"
              : previous.numberFormat,
        }));
      },
      setRegion: (region) => {
        setPreferences((previous) => ({
          ...previous,
          region,
        }));
      },
      setCurrency: (currency) => {
        setPreferences((previous) => ({
          ...previous,
          currency,
        }));
      },
      setTimezone: (timezone) => {
        setPreferences((previous) => ({
          ...previous,
          timezone,
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
      dismissDetectionBanner: () => {
        setShowDetectionBanner(false);
        dismissInternationalBanner();
      },
      t: (key, values) => {
        const adminSettings = getStoredLanguageAdminSettings();
        const isEnabled = adminSettings.enabledLanguages.includes(preferences.language);

        const languageToUse = isEnabled
          ? preferences.language
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
