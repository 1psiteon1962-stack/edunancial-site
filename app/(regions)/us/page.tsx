"use client";

import { useState } from "react";
import LanguageToggle from "@/components/LanguageToggle";
import { DEFAULT_LANGUAGE, t } from "@/lib/i18n";

/**
 * Local language type.
 * We intentionally DO NOT import Language from i18n
 * to avoid Netlify/TS export resolution failures.
 */
type Language = "en" | "es";

export default function USHomePage() {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE as Language);

  return (
    <main style={{ padding: 24 }}>
      <LanguageToggle
        value={language}
        onChange={(lang) => setLanguage(lang as Language)}
      />

      <h1 style={{ fontSize: 30, marginTop: 24 }}>
        {t("homeTitle", language)}
      </h1>

      <p style={{ marginTop: 8, opacity: 0.8 }}>
        {t("homeSubtitle", language)}
      </p>
    </main>
  );
}
