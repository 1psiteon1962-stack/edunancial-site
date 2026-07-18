"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function CookiePolicyClient() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">{t("cookies.label")}</p>
        <h1 className="mt-4 text-5xl font-black">{t("cookies.title")}</h1>
        <p className="mt-6 leading-8 text-slate-300">{t("cookies.intro")}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-black">{t(`cookies.category${index}.title`)}</h2>
              <p className="mt-3 leading-7 text-slate-300">{t(`cookies.category${index}.body`)}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 leading-8 text-slate-300">{t("cookies.footer")}</p>
      </section>
    </main>
  );
}
