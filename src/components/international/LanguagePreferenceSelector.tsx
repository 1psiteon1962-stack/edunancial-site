"use client";

import { useMemo, useState } from "react";

import {
  getStoredLanguageAdminSettings,
  LANGUAGE_CATALOG,
  normalizeLanguageCode,
} from "@/lib/international/languages";
import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

type LanguagePreferenceSelectorProps = {
  compact?: boolean;
};

export default function LanguagePreferenceSelector({
  compact = false,
}: LanguagePreferenceSelectorProps) {
  const {
    effectiveLanguage,
    languagePreferenceMode,
    languagePromptPending,
    setLanguage,
    confirmLanguageDefault,
    resetToAutomatic,
    t,
  } = useInternationalPreferences();
  const [searchValue, setSearchValue] = useState("");
  const settings = getStoredLanguageAdminSettings();
  const enabledLanguages = useMemo(() => {
    return LANGUAGE_CATALOG.filter((language) =>
      settings.enabledLanguages.includes(language.code)
    );
  }, [settings.enabledLanguages]);
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
  const selectedLanguage = useMemo(() => {
    const normalized = normalizeLanguageCode(effectiveLanguage);

    return filteredLanguages.some((language) => language.code === normalized)
      ? normalized
      : filteredLanguages[0]?.code ?? normalized;
  }, [effectiveLanguage, filteredLanguages]);

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
        placeholder={t("selector.searchPlaceholder")}
        aria-label={t("selector.searchAria")}
      />
      <select
        aria-label={t("selector.aria")}
        value={selectedLanguage}
        onChange={(event) => setLanguage(event.target.value)}
        className="bg-transparent text-white outline-none"
      >
        {filteredLanguages.map((language) => (
          <option key={language.code} value={language.code} className="text-black">
            {language.nativeLabel}
          </option>
        ))}
      </select>

      {languagePromptPending && (
        <div
          role="dialog"
          aria-live="polite"
          className="mt-1 rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-3 py-3 text-xs"
        >
          <p className="font-semibold text-yellow-200">
            {t("selector.defaultPrompt")}
          </p>
          <div className="mt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => confirmLanguageDefault(false)}
              className="rounded-md border border-white/20 px-3 py-1.5 font-semibold text-white transition hover:bg-white/10"
            >
              {t("selector.sessionOnly")}
            </button>
            <button
              type="button"
              onClick={() => confirmLanguageDefault(true)}
              className="rounded-md bg-yellow-400 px-3 py-1.5 font-bold text-slate-950 transition hover:bg-yellow-300"
            >
              {t("selector.setDefault.yes")}
            </button>
            <button
              type="button"
              onClick={resetToAutomatic}
              className="rounded-md border border-white/10 px-3 py-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              {t("selector.resetToAuto")}
            </button>
          </div>
        </div>
      )}

      {!languagePromptPending && languagePreferenceMode !== "auto" && (
        <button
          type="button"
          onClick={resetToAutomatic}
          className="mt-1 rounded-md border border-white/10 px-2 py-1 text-xs text-slate-400 transition hover:bg-white/5 hover:text-white"
          title={t("selector.resetToAuto")}
        >
          {t("selector.resetToAuto")}
        </button>
      )}
    </div>
  );
}
