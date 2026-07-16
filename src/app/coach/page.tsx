"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function AICoachPage() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h1 className="text-6xl font-black">
          {t("page.coach.title")}
        </h1>
        <p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">
          {t("page.coach.description")}
        </p>
        <div className="mt-16 rounded-xl bg-slate-900 p-10">
          {t("page.coach.window")}
        </div>
      </section>
    </main>
  );
}
