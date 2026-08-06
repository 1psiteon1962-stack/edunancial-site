// src/components/LocalizedDoctrine.tsx

"use client";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

export default function LocalizedDoctrine() {
  const { t } = useInternationalPreferences();

  return (
    <section>
      <h2>{t("doctrine_title")}</h2>
      <p>{t("doctrine_body")}</p>
    </section>
  );
}
