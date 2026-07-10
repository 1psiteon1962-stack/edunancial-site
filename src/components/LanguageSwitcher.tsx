"use client";

import { getAriaLabel, supportedLanguages, useI18n } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <label className="flex items-center gap-2 text-sm text-slate-300">
      <span className="sr-only">{getAriaLabel("nav.select_language", locale)}</span>
      <select
        aria-label={getAriaLabel("nav.select_language", locale)}
        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
        value={locale}
        onChange={(event) => setLocale(event.target.value)}
      >
        {supportedLanguages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.nativeLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
