"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function AccessibilityPageClient() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">{t("accessibility.label")}</p>
        <h1 className="mt-4 text-5xl font-black">{t("accessibility.title")}</h1>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300">{t("accessibility.intro")}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[1, 2].map((index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-black">{t(`accessibility.item${index}.title`)}</h2>
              <p className="mt-3 leading-7 text-slate-300">{t(`accessibility.item${index}.body`)}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
