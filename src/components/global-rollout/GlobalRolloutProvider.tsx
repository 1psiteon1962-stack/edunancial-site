"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  GLOBAL_ROLLOUT_STORAGE_KEYS,
  getActiveCountry,
  getActiveRegion,
  getCountries,
  getCountriesForRegion,
  getEnabledCurrencies,
  getEnabledLanguages,
  getRegions,
} from "@/lib/global-rollout/service";

import type {
  CountryRolloutDefinition,
  CurrencyDefinition,
  LanguageDefinition,
  RegionDefinition,
} from "@/types/global-rollout";

interface GlobalRolloutContextValue {
  activeCountry: CountryRolloutDefinition;
  activeRegion: RegionDefinition;
  countries: CountryRolloutDefinition[];
  regions: RegionDefinition[];
  languages: LanguageDefinition[];
  currencies: CurrencyDefinition[];
  selectedLanguage: string;
  selectedCurrency: string;
  setCountry: (countryCode: string) => void;
  setRegion: (regionCode: string) => void;
  setLanguage: (languageCode: string) => void;
  setCurrency: (currencyCode: string) => void;
}

const GlobalRolloutContext = createContext<GlobalRolloutContextValue | undefined>(undefined);

function getFirstCountryForRegion(regionCode: string) {
  const countries = getCountriesForRegion(regionCode);
  return countries.find((country) => country.enabled) ?? countries[0] ?? getActiveCountry();
}

export function GlobalRolloutProvider({ children }: { children: ReactNode }) {
  const [activeCountryCode, setActiveCountryCode] = useState(getActiveCountry().code);
  const [selectedLanguage, setSelectedLanguage] = useState(getActiveCountry().defaultLanguage);
  const [selectedCurrency, setSelectedCurrency] = useState(getActiveCountry().defaultCurrency);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedCountry = window.localStorage.getItem(GLOBAL_ROLLOUT_STORAGE_KEYS.country);
    const storedLanguage = window.localStorage.getItem(GLOBAL_ROLLOUT_STORAGE_KEYS.language);
    const storedCurrency = window.localStorage.getItem(GLOBAL_ROLLOUT_STORAGE_KEYS.currency);
    const country = getActiveCountry(storedCountry ?? undefined);
    const languages = getEnabledLanguages(country.code);
    const currencies = getEnabledCurrencies(country.code);

    setActiveCountryCode(country.code);
    setSelectedLanguage(
      languages.find((language) => language.code === storedLanguage)?.code ?? country.defaultLanguage
    );
    setSelectedCurrency(
      currencies.find((currency) => currency.code === storedCurrency)?.code ?? country.defaultCurrency
    );
  }, []);

  const activeCountry = useMemo(() => getActiveCountry(activeCountryCode), [activeCountryCode]);
  const activeRegion = useMemo(() => getActiveRegion(activeCountry.code), [activeCountry.code]);
  const languages = useMemo(() => getEnabledLanguages(activeCountry.code), [activeCountry.code]);
  const currencies = useMemo(() => getEnabledCurrencies(activeCountry.code), [activeCountry.code]);

  useEffect(() => {
    if (!languages.some((language) => language.code === selectedLanguage)) {
      setSelectedLanguage(activeCountry.defaultLanguage);
    }
  }, [activeCountry.defaultLanguage, languages, selectedLanguage]);

  useEffect(() => {
    if (!currencies.some((currency) => currency.code === selectedCurrency)) {
      setSelectedCurrency(activeCountry.defaultCurrency);
    }
  }, [activeCountry.defaultCurrency, currencies, selectedCurrency]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(GLOBAL_ROLLOUT_STORAGE_KEYS.country, activeCountry.code);
    window.localStorage.setItem(GLOBAL_ROLLOUT_STORAGE_KEYS.language, selectedLanguage);
    window.localStorage.setItem(GLOBAL_ROLLOUT_STORAGE_KEYS.currency, selectedCurrency);
  }, [activeCountry.code, selectedCurrency, selectedLanguage]);

  const value = useMemo<GlobalRolloutContextValue>(
    () => ({
      activeCountry,
      activeRegion,
      countries: getCountries(),
      regions: getRegions(),
      languages,
      currencies,
      selectedLanguage,
      selectedCurrency,
      setCountry: (countryCode: string) => {
        const country = getActiveCountry(countryCode);
        setActiveCountryCode(country.code);
        setSelectedLanguage(country.defaultLanguage);
        setSelectedCurrency(country.defaultCurrency);
      },
      setRegion: (regionCode: string) => {
        const country = getFirstCountryForRegion(regionCode);
        setActiveCountryCode(country.code);
        setSelectedLanguage(country.defaultLanguage);
        setSelectedCurrency(country.defaultCurrency);
      },
      setLanguage: (languageCode: string) => setSelectedLanguage(languageCode as typeof activeCountry.defaultLanguage),
      setCurrency: (currencyCode: string) => setSelectedCurrency(currencyCode as typeof activeCountry.defaultCurrency),
    }),
    [
      activeCountry,
      activeRegion,
      currencies,
      languages,
      selectedCurrency,
      selectedLanguage,
    ]
  );

  return (
    <GlobalRolloutContext.Provider value={value}>
      {children}
    </GlobalRolloutContext.Provider>
  );
}

export function useGlobalRollout() {
  const context = useContext(GlobalRolloutContext);

  if (!context) {
    throw new Error("useGlobalRollout must be used within GlobalRolloutProvider");
  }

  return context;
}
