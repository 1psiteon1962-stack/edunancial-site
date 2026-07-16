"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function CountryCard() {
  const { t } = useInternationalPreferences();

  return (
    <div className="rounded-xl border p-6 shadow">
      <h3 className="text-2xl font-bold">{t("globalExpansion.countryCard.title")}</h3>
      <ul className="mt-4 space-y-2">
        <li>{t("globalExpansion.countryCard.language")}</li>
        <li>{t("globalExpansion.countryCard.currency")}</li>
        <li>{t("globalExpansion.countryCard.pricing")}</li>
        <li>{t("globalExpansion.countryCard.paymentMethods")}</li>
        <li>{t("globalExpansion.countryCard.marketplace")}</li>
      </ul>
    </div>
  );
}
