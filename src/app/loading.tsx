"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function Loading() {
  const { t } = useInternationalPreferences();

  return (
    <main
      style={{
        padding: "100px",
        textAlign: "center",
        fontFamily: "Arial,sans-serif",
      }}
    >
      <h1>{t("loading.title")}</h1>
      <p>{t("loading.wait")}</p>
    </main>
  );
}
