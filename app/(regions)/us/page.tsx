"use client";

import { useState } from "react";
import LanguageToggle from "@/components/LanguageToggle";
import { Language, DEFAULT_LANGUAGE, t } from "@/lib/i18n";

export default function USHomePage() {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);

  return (
    <main className="p-8">
      <LanguageToggle
        language={language}
        onChange={(lang: Language) => setLanguage(lang)}
      />

      <h1 className="text-3xl font-bold mt-6">
        {t("home_title", language)}
      </h1>

      <p className="mt-4 text-lg">
        {t("home_subtitle", language)}
      </p>
    </main>
  );
}
