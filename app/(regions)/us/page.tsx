"use client";

import { useState } from "react";
import LanguageToggle from "@/components/LanguageToggle";
import { Language, DEFAULT_LANGUAGE, t } from "@/lib/i18n";

export default function USHomePage() {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);

  return (
    <main style={{ padding: 24 }}>
      <LanguageToggle language={language} setLanguage={setLanguage} />

      <h1 style={{ fontSize: 32, marginTop: 24 }}>
        {t("homeTitle", language)}
      </h1>

      <p style={{ marginTop: 8, opacity: 0.8 }}>
        {t("homeSubtitle", language)}
      </p>
    </main>
  );
}
