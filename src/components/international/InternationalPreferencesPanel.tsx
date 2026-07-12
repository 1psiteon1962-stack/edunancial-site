"use client";

import { currencies } from "@/lib/location/currencies";
import { countries } from "@/lib/location/countries";
import { supportedTimezones } from "@/lib/location/timezones";
import { regionalSettings } from "@/lib/regionalSettings";
import LanguagePreferenceSelector from "@/components/international/LanguagePreferenceSelector";
import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import { resolveAvailablePaymentMethods } from "@/lib/international/preference-architecture";

const dateFormats = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];
const numberFormats = ["1,234.56", "1.234,56", "1 234,56"];

export default function InternationalPreferencesPanel() {
  const {
    preferences,
    setCountry,
    setRegion,
    setCurrency,
    setTimezone,
    setDateFormat,
    setNumberFormat,
    setMeasurementSystem,
    setPreferredPaymentMethod,
    t,
  } = useInternationalPreferences();
  const availablePaymentMethods = resolveAvailablePaymentMethods(
    preferences.region,
    preferences.country
  );

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/60 p-8">
      <h2 className="text-2xl font-black text-white">{t("settings.international")}</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-slate-300">{t("settings.language")}</p>
          <LanguagePreferenceSelector compact />
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-300">Country</span>
          <select
            value={preferences.country}
            onChange={(event) => setCountry(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
          >
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-300">{t("settings.region")}</span>
          <select
            value={preferences.region}
            onChange={(event) => setRegion(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
          >
            {regionalSettings.map((region) => (
              <option key={region.region} value={region.region}>
                {region.region}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-300">{t("settings.currency")}</span>
          <select
            value={preferences.preferredCurrency}
            onChange={(event) => setCurrency(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-300">Payment method</span>
          <select
            value={preferences.preferredPaymentMethod}
            onChange={(event) => setPreferredPaymentMethod(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
          >
            {availablePaymentMethods.map((paymentMethod) => (
              <option key={paymentMethod} value={paymentMethod}>
                {paymentMethod}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-300">{t("settings.timezone")}</span>
          <select
            value={preferences.timeZone}
            onChange={(event) => setTimezone(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
          >
            {supportedTimezones.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-300">{t("settings.dateFormat")}</span>
          <select
            value={preferences.dateFormat}
            onChange={(event) => setDateFormat(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
          >
            {dateFormats.map((dateFormat) => (
              <option key={dateFormat} value={dateFormat}>
                {dateFormat}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-300">{t("settings.numberFormat")}</span>
          <select
            value={preferences.numberFormat}
            onChange={(event) => setNumberFormat(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
          >
            {numberFormats.map((numberFormat) => (
              <option key={numberFormat} value={numberFormat}>
                {numberFormat}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-300">{t("settings.measurementSystem")}</span>
          <select
            value={preferences.measurementSystem}
            onChange={(event) =>
              setMeasurementSystem(event.target.value as "metric" | "imperial")
            }
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
          >
            <option value="metric">{t("settings.measurementMetric")}</option>
            <option value="imperial">{t("settings.measurementImperial")}</option>
          </select>
        </label>
      </div>
    </section>
  );
}
