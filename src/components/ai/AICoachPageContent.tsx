"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

const featureKeys = [
  "aiCoach.features.personal",
  "aiCoach.features.business",
  "aiCoach.features.investment",
  "aiCoach.features.courseRecommendations",
  "aiCoach.features.bookRecommendations",
  "aiCoach.features.goalTracking",
  "aiCoach.features.competencyAnalysis",
  "aiCoach.features.alwaysOnSupport",
] as const;

export default function AICoachPageContent() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          {t("aiCoach.label")}
        </p>
        <h1 className="mt-6 text-5xl font-black md:text-6xl">{t("aiCoach.title")}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          {t("aiCoach.description")}
        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-2">
          {featureKeys.map((featureKey) => (
            <div key={featureKey} className="rounded-xl bg-slate-900 p-8">
              <h2 className="text-2xl font-black">{t(featureKey)}</h2>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
