"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function CountryDashboard() {
  const { t } = useInternationalPreferences();

  return (
    <section className="rounded-xl bg-white p-8 shadow">
      <h2 className="text-3xl font-bold">{t("globalExpansion.countryDashboard.title")}</h2>
      <p className="mt-4">{t("globalExpansion.countryDashboard.description")}</p>
    </section>
  );
}
