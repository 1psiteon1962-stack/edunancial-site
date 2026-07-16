"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function TeamPage() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-10">
        <h1 className="text-5xl font-black">
          {t("page.team.title")}
        </h1>
        <div className="grid lg:grid-cols-3 gap-8 mt-10">
          <div className="rounded-xl border p-8">
            {t("page.team.founder")}
          </div>
          <div className="rounded-xl border p-8">
            {t("page.team.leadership")}
          </div>
          <div className="rounded-xl border p-8">
            {t("page.team.advisors")}
          </div>
        </div>
      </div>
    </main>
  );
}
