"use client";

import { useEffect, useRef } from "react";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { getCountryCurrency } from "@/lib/international/country-currency";
import { regionalLocaleForNetworkCountry } from "@/lib/international/detection";

interface CountryDetectionPayload {
  success?: boolean;
  detected?: boolean;
  countryCode?: string;
  currency?: string | null;
  timezone?: string | null;
}

/**
 * Network geography is the automatic country source for commercial display.
 * Browser language remains a language hint, not a substitute for country.
 * Manual country controls can still be used when network detection is
 * unavailable; checkout independently reconciles the final country.
 */
export default function NetworkCountrySync() {
  const { ready, preferences, effectiveLanguage, setCountry, setCurrency, setTimezone, setDetectedRegionalLocale } = useInternationalPreferences();
  const attempted = useRef(false);

  useEffect(() => {
    if (!ready || attempted.current) return;
    attempted.current = true;
    let cancelled = false;

    void fetch("/api/location/network-country", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as CountryDetectionPayload;
        if (cancelled || !response.ok || !payload.success || !payload.detected || !payload.countryCode) return;

        const detectedCountry = payload.countryCode.toLowerCase();
        const regionalLocale = regionalLocaleForNetworkCountry(detectedCountry, effectiveLanguage);
        if (regionalLocale) setDetectedRegionalLocale(regionalLocale);
        if (preferences.country.toLowerCase() !== detectedCountry) setCountry(detectedCountry);
        // The edge profile only knows a few countries; every other country (e.g. UG -> UGX)
        // resolves from the full country dataset instead of keeping a stale/default USD.
        const detectedCurrency = payload.currency ?? getCountryCurrency(detectedCountry);
        if (detectedCurrency && preferences.preferredCurrency !== detectedCurrency) setCurrency(detectedCurrency);
        if (payload.timezone && preferences.timeZone !== payload.timezone) setTimezone(payload.timezone);
      })
      .catch(() => {
        // Detection failure must not invent a country. Checkout remains fail-closed.
      });

    return () => {
      cancelled = true;
    };
  }, [preferences.country, preferences.preferredCurrency, ready, effectiveLanguage, setCountry, setCurrency, setTimezone, setDetectedRegionalLocale]);

  return null;
}
