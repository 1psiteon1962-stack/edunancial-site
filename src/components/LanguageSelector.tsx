"use client";

import { getAriaLabel, supportedLanguages, useI18n } from "@/lib/i18n";

export default function LanguageSelector() {
  const { locale, setLocale } = useI18n();

  return (
    <select
      aria-label={getAriaLabel("nav.select_language", locale)}
      value={locale}
      onChange={(event) => setLocale(event.target.value)}
      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
    >
      {supportedLanguages.map((language) => (
        <option key={language.code} value={language.code}>
          {language.nativeLabel}
        </option>
      ))}
    </select>
  );
}
