"use client";

import Link from "next/link";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

const launchPriorityKeys = [
  "latinAmerica.launchPriority.1",
  "latinAmerica.launchPriority.2",
  "latinAmerica.launchPriority.3",
  "latinAmerica.launchPriority.4",
] as const;

const marketKeyPairs = [
  { countryKey: "latinAmerica.markets.mexico.country", detailKey: "latinAmerica.markets.mexico.detail" },
  { countryKey: "latinAmerica.markets.colombia.country", detailKey: "latinAmerica.markets.colombia.detail" },
  { countryKey: "latinAmerica.markets.brazil.country", detailKey: "latinAmerica.markets.brazil.detail" },
  { countryKey: "latinAmerica.markets.argentina.country", detailKey: "latinAmerica.markets.argentina.detail" },
  { countryKey: "latinAmerica.markets.peru.country", detailKey: "latinAmerica.markets.peru.detail" },
  { countryKey: "latinAmerica.markets.centralAmerica.country", detailKey: "latinAmerica.markets.centralAmerica.detail" },
] as const;

export default function LatinAmericaPageContent() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          {t("latinAmerica.label")}
        </p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          {t("latinAmerica.title")}
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          {t("latinAmerica.description")}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/membership"
            className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700"
          >
            {t("latinAmerica.primaryCta")}
          </Link>
          <Link
            href="/assessment"
            className="rounded-xl border border-white px-8 py-4 text-lg font-bold hover:bg-white hover:text-slate-950"
          >
            {t("latinAmerica.secondaryCta")}
          </Link>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-950/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-16 md:grid-cols-4">
          {launchPriorityKeys.map((key) => (
            <div key={key} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-lg font-bold leading-8">{t(key)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-3xl font-black text-white">{t("latinAmerica.keyMarkets")}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {marketKeyPairs.map((market) => (
            <div key={market.countryKey} className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h3 className="text-xl font-bold text-white">{t(market.countryKey)}</h3>
              <p className="mt-2 text-slate-300">{t(market.detailKey)}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
