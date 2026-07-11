"use client";

import {
  getStoredLanguageAdminSettings,
  LANGUAGE_CATALOG,
} from "@/lib/international/languages";
import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

type LanguagePreferenceSelectorProps = {
  compact?: boolean;
};

export default function LanguagePreferenceSelector({
  compact = false,
}: LanguagePreferenceSelectorProps) {
  const { preferences, setLanguage, t } = useInternationalPreferences();
  const settings = getStoredLanguageAdminSettings();
  const enabledLanguages = LANGUAGE_CATALOG.filter((language) =>
    settings.enabledLanguages.includes(language.code)
  );

  return (
    <label
      className={`inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm ${
        compact ? "w-full" : ""
      }`}
    >
      <span aria-hidden="true">🌐</span>
      <span className="sr-only">{t("selector.aria")}</span>
      {!compact && <span className="text-slate-300">{t("selector.label")}</span>}
      <select
        aria-label={t("selector.aria")}
        value={preferences.language}
        onChange={(event) => setLanguage(event.target.value)}
        className="bg-transparent text-white outline-none"
      >
        {enabledLanguages.map((language) => (
          <option key={language.code} value={language.code} className="text-black">
            {language.nativeLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
