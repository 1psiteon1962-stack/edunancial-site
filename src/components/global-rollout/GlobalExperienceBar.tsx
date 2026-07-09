"use client";

import { usePathname } from "next/navigation";

import { useGlobalRollout } from "@/components/global-rollout/GlobalRolloutProvider";

function formatOptionLabel(name: string, enabled: boolean) {
  return enabled ? name : `${name} (coming soon)`;
}

export default function GlobalExperienceBar() {
  const pathname = usePathname();
  const {
    activeCountry,
    activeRegion,
    countries,
    regions,
    languages,
    currencies,
    selectedCurrency,
    selectedLanguage,
    setCountry,
    setCurrency,
    setLanguage,
    setRegion,
  } = useGlobalRollout();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <section className="border-b border-slate-800 bg-[#0d1628] text-white">
      <div className="mx-auto grid max-w-7xl gap-4 px-6 py-4 md:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto] xl:items-end">
        <label className="text-sm font-semibold text-slate-200">
          <span className="mb-2 block">Region</span>
          <select
            value={activeRegion.code}
            onChange={(event) => setRegion(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            aria-label="Select your region"
          >
            {regions.map((region) => (
              <option key={region.code} value={region.code}>
                {formatOptionLabel(region.name, region.enabled)}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold text-slate-200">
          <span className="mb-2 block">Country</span>
          <select
            value={activeCountry.code}
            onChange={(event) => setCountry(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            aria-label="Select your country"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {formatOptionLabel(country.name, country.enabled)}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold text-slate-200">
          <span className="mb-2 block">Language</span>
          <select
            value={selectedLanguage}
            onChange={(event) => setLanguage(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            aria-label="Select your language"
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.nativeName}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold text-slate-200">
          <span className="mb-2 block">Currency</span>
          <select
            value={selectedCurrency}
            onChange={(event) => setCurrency(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            aria-label="Select your currency"
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} · {currency.symbol}
              </option>
            ))}
          </select>
        </label>

        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            activeCountry.enabled
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
              : "border-amber-500/40 bg-amber-500/10 text-amber-100"
          }`}
          aria-live="polite"
        >
          <p className="font-semibold">{activeCountry.enabled ? "Market active" : "Launch in progress"}</p>
          <p className="mt-1 text-xs text-inherit/90">
            {activeCountry.enabled
              ? `${activeCountry.name} is enabled in the current rollout configuration.`
              : `${activeCountry.name} is configured, but not available for public launch yet.`}
          </p>
        </div>
      </div>
    </section>
  );
}
