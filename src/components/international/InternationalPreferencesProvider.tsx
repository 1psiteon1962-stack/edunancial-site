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
import { useAuth } from "@/lib/authContext";

type InternationalPreferencesContextValue = {
  ready: boolean;
  preferences: InternationalPreferences;
  /** Language active for this session (may differ from persisted preferences.preferredLanguage). */
  effectiveLanguage: string;
  /** True while awaiting the user's YES/NO response to "make this your default?" */
  languagePromptPending: boolean;
  showDetectionBanner: boolean;
  setLanguage: (language: string) => void;
  /** Call after setLanguage: true = persist as default, false = session-only. */
  confirmLanguageDefault: (makeDefault: boolean) => void;
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
  effectiveLanguage: defaultPreferences.preferredLanguage,
  languagePromptPending: false,
  showDetectionBanner: false,
  setLanguage: () => {},
  confirmLanguageDefault: () => {},
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
  /** Language chosen this session but not yet persisted as a default. */
  const [sessionLanguage, setSessionLanguage] = useState<string | null>(null);
  /** Whether a YES/NO default-language prompt is awaiting the user's answer. */
  const [languagePromptPending, setLanguagePromptPending] = useState(false);

  const { user } = useAuth();

  // Reload preferences whenever the authenticated user changes (login / logout).
  useEffect(() => {
    const stored = loadInternationalPreferences();

    if (stored) {
      setPreferences(stored);
      setShowDetectionBanner(false);
      // Clear any pending session-only language when switching user profiles.
      setSessionLanguage(null);
      setLanguagePromptPending(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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

    const langToApply = sessionLanguage ?? preferences.preferredLanguage;
    document.documentElement.lang = normalizeLanguageCode(langToApply);
    document.documentElement.dir = isRtlLanguage(langToApply) ? "rtl" : "ltr";
  }, [preferences, sessionLanguage, ready]);

  const contextValue = useMemo<InternationalPreferencesContextValue>(() => {
    const effectiveLanguage = sessionLanguage ?? preferences.preferredLanguage;
    return {
      ready,
      preferences,
      effectiveLanguage,
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
        const isEnabled = adminSettings.enabledLanguages.includes(effectiveLanguage);

        const languageToUse = isEnabled
          ? effectiveLanguage
          : adminSettings.fallbackLanguage;

        return translate(languageToUse, key, values);
      },
    };
  }, [preferences, sessionLanguage, languagePromptPending, ready, showDetectionBanner]);

  return (
    <InternationalPreferencesContext.Provider value={contextValue}>
      {children}
    </InternationalPreferencesContext.Provider>
  );
}

export function useInternationalPreferences() {
  return useContext(InternationalPreferencesContext);
}
