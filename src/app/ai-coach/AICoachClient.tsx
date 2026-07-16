"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

const AI_COACH_FEATURE_KEYS = [
  "aiCoach.feature.personalCoach",
  "aiCoach.feature.businessCoach",
  "aiCoach.feature.investmentGuidance",
  "aiCoach.feature.courseRecs",
  "aiCoach.feature.bookRecs",
  "aiCoach.feature.goalTracking",
  "aiCoach.feature.competencyAnalysis",
  "aiCoach.feature.assistance247",
] as const;

export default function AICoachClient() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">{t("aiCoach.label")}</p>
        <h1 className="mt-6 text-5xl font-black md:text-6xl">
          {t("aiCoach.heading1")}
          <br />
          {t("aiCoach.heading2")}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          {t("aiCoach.description")}
        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-2">
          {AI_COACH_FEATURE_KEYS.map((key) => (
            <div key={key} className="rounded-xl bg-slate-900 p-8">
              <h2 className="text-2xl font-black">{t(key)}</h2>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-2xl border border-slate-800 bg-slate-900/80 p-10 text-center">
          <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">{t("aiCoach.cta.label")}</p>
          <h2 className="mt-4 text-4xl font-black">{t("aiCoach.cta.heading")}</h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-300">{t("aiCoach.cta.description")}</p>
          <button
            type="button"
            className="mt-8 rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold transition hover:bg-blue-700"
          >
            {t("aiCoach.cta.button")}
          </button>
          <p className="mt-4 text-sm text-slate-500">{t("aiCoach.languageNote")}</p>
        </div>
      </section>
    </main>
  );
}
