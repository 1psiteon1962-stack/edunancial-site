"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function CareersPageContent() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          {t("careers.label")}
        </p>
        <h1 className="mt-6 text-6xl font-black">{t("careers.title")}</h1>
        <p className="mt-10 text-2xl leading-10 text-slate-300">
          {t("careers.description")}
        </p>
      </section>
    </main>
  );
}
