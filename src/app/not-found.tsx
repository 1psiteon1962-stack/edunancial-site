"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function NotFound() {
  const { t } = useInternationalPreferences();

  return (
    <main
      style={{
        textAlign: "center",
        padding: "100px",
        fontFamily: "Arial,sans-serif",
      }}
    >
      <h1>404</h1>
      <h2>{t("notFound.title")}</h2>
      <p>{t("notFound.body")}</p>
      <p>{t("notFound.nextStep")}</p>
    </main>
  );
}
