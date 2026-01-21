"use client";

import { useState } from "react";
import LanguageToggle from "@/components/LanguageToggle";
import { Language, DEFAULT_LANGUAGE, t } from "@/lib/i18n";

export default function USHomePage() {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);

  return (
    <main style={{ padding: 24 }}>
      <LanguageToggle
        value={language}
        onChange={(lang) => setLanguage(lang as Language)}
      />

      <h1 style={{ marginTop: 24 }}>
        {t("welcome", language)}
      </h1>
    </main>
  );
}
