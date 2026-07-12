"use client";

import { useMemo, useState } from "react";

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
  const [searchValue, setSearchValue] = useState("");
  const settings = getStoredLanguageAdminSettings();
  const enabledLanguages = useMemo(
    () =>
      LANGUAGE_CATALOG.filter((language) => settings.enabledLanguages.includes(language.code)),
    [settings.enabledLanguages]
  );
  const filteredLanguages = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    if (!normalizedSearch) {
      return enabledLanguages;
    }

    return enabledLanguages.filter((language) =>
      `${language.label} ${language.nativeLabel} ${language.code}`
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [enabledLanguages, searchValue]);

  return (
    <div
      className={`inline-flex flex-col gap-2 rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm ${
        compact ? "w-full" : ""
      }`}
    >
      <div className="inline-flex items-center gap-2">
        <span aria-hidden="true">🌐</span>
        <span className="sr-only">{t("selector.aria")}</span>
        {!compact && <span className="text-slate-300">{t("selector.label")}</span>}
      </div>
      <input
        type="search"
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white"
        placeholder="Search language…"
        aria-label="Search languages"
      />
      <select
        aria-label={t("selector.aria")}
        value={preferences.preferredLanguage}
        onChange={(event) => setLanguage(event.target.value)}
        className="bg-transparent text-white outline-none"
      >
        {filteredLanguages.map((language) => (
          <option key={language.code} value={language.code} className="text-black">
            {language.nativeLabel}
          </option>
        ))}
      </select>
    </div>
  );
}
