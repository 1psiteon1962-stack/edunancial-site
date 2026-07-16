"use client";

import GlobalExpansionDashboard from "@/components/localization/GlobalExpansionDashboard";
import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function GlobalExpansionPage() {
  const { t } = useInternationalPreferences();

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl p-10">
        <h1 className="text-5xl font-black">{t("globalExpansion.title")}</h1>
        <p className="mt-6 text-lg">{t("globalExpansion.description")}</p>
        <GlobalExpansionDashboard />
      </div>
    </main>
  );
}
