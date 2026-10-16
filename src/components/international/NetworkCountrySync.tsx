"use client";

import { useEffect, useRef } from "react";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { spanishLocaleForNetworkCountry } from "@/lib/international/detection";

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
  const { ready, preferences, setCountry, setCurrency, setTimezone, setDetectedSpanishLocale } = useInternationalPreferences();
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
        const spanishDialect = spanishLocaleForNetworkCountry(detectedCountry);
        if (spanishDialect) setDetectedSpanishLocale(spanishDialect);
        if (preferences.country.toLowerCase() !== detectedCountry) setCountry(detectedCountry);
        if (payload.currency && preferences.preferredCurrency !== payload.currency) setCurrency(payload.currency);
        if (payload.timezone && preferences.timeZone !== payload.timezone) setTimezone(payload.timezone);
      })
      .catch(() => {
        // Detection failure must not invent a country. Checkout remains fail-closed.
      });

    return () => {
      cancelled = true;
    };
  }, [preferences.country, preferences.preferredCurrency, ready, setCountry, setCurrency, setTimezone, setDetectedSpanishLocale]);

  return null;
}
