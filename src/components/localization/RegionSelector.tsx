"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function RegionSelector() {
  const { t } = useInternationalPreferences();

  return (
    <select className="rounded-lg border p-2">
      <option>{t("globalExpansion.region.northAmerica")}</option>
      <option>{t("globalExpansion.region.latinAmerica")}</option>
      <option>{t("globalExpansion.region.caribbean")}</option>
      <option>{t("globalExpansion.region.africa")}</option>
      <option>{t("globalExpansion.region.middleEast")}</option>
      <option>{t("globalExpansion.region.asia")}</option>
      <option>{t("globalExpansion.region.europe")}</option>
    </select>
  );
}
