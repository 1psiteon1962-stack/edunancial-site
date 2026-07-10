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

import { getHtmlDir } from "./rtl";
import { getHtmlLang } from "./a11y";
import { getPreferredLocale } from "./locale-detection";
import {
  DEFAULT_LANGUAGE,
  LOCALE_STORAGE_KEY,
  isLanguage,
  type SupportedLanguage,
} from "./languages";
import { translateStatic } from "./registry";

export type I18nContextValue = {
  locale: SupportedLanguage;
  setLocale: (locale: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({
  children,
  initialLocale = DEFAULT_LANGUAGE,
}: {
  children: ReactNode;
  initialLocale?: string;
}) {
  const [locale, setLocaleState] = useState<SupportedLanguage>(
    isLanguage(initialLocale) ? initialLocale : DEFAULT_LANGUAGE
  );

  useEffect(() => {
    const preferredLocale = getPreferredLocale();
    if (isLanguage(preferredLocale)) {
      setLocaleState(preferredLocale);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    }

    if (typeof document !== "undefined") {
      document.documentElement.lang = getHtmlLang(locale);
      document.documentElement.dir = getHtmlDir(locale);
    }
  }, [locale]);

  const setLocale = useCallback((nextLocale: string) => {
    setLocaleState(isLanguage(nextLocale) ? nextLocale : DEFAULT_LANGUAGE);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string>) =>
      translateStatic(locale, key, params),
    [locale]
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18nContext(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider.");
  }

  return context;
}
