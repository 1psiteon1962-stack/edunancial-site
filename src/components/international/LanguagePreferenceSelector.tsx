"use client";

import { useMemo, useState, useRef, useEffect } from "react";

import {
  getStoredLanguageAdminSettings,
  LANGUAGE_CATALOG,
  normalizeLanguageCode,
} from "@/lib/international/languages";
import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";

type LanguagePreferenceSelectorProps = {
  compact?: boolean;
};

const NORTH_AMERICA_LAUNCH_LANGUAGE_CODES = [
  "en-US",
  "es",
  "fr-CA",
  "fr-FR",
] as const;

export default function LanguagePreferenceSelector({
  compact = false,
}: LanguagePreferenceSelectorProps) {
  const {
    effectiveLanguage,
    preferences,
    languagePromptPending,
    setLanguage,
    confirmLanguageDefault,
    t,
  } = useInternationalPreferences();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const settings = getStoredLanguageAdminSettings();

  const enabledLanguages = useMemo(() => {
    const available = LANGUAGE_CATALOG.filter((language) =>
      settings.enabledLanguages.includes(language.code)
    );

    if (preferences.region !== "north-america") {
      return available;
    }

    return NORTH_AMERICA_LAUNCH_LANGUAGE_CODES.map((code) =>
      available.find((language) => language.code === code)
    ).filter((language): language is (typeof available)[number] => Boolean(language));
  }, [preferences.region, settings.enabledLanguages]);

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
    return enabledLanguages.find((language) => language.code === normalized) ?? enabledLanguages[0];
  }, [effectiveLanguage, enabledLanguages]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [isOpen]);

  // Focus search when dropdown opens
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  function handleSelect(code: string) {
    setLanguage(code);
    setIsOpen(false);
    setSearchValue("");
  }

  const currentLabel = selectedLanguage?.nativeLabel ?? effectiveLanguage;

  return (
    <div ref={containerRef} className={`relative ${compact ? "w-full" : "inline-block"}`}>
      {/* Trigger button — always shows the currently selected language */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t("selector.current", { language: currentLabel })}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          compact ? "w-full justify-between" : ""
        }`}
      >
        <span className="flex items-center gap-2">
          <span aria-hidden="true">🌐</span>
          <span>{currentLabel}</span>
        </span>
        <span aria-hidden="true" className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={t("selector.aria")}
          onKeyDown={handleKeyDown}
          className={`absolute z-50 mt-1 rounded-lg border border-slate-700 bg-slate-950 shadow-xl ${
            compact ? "left-0 right-0" : "right-0 min-w-[200px]"
          }`}
        >
          <div className="p-2">
            <input
              ref={searchRef}
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder={t("selector.searchPlaceholder")}
              aria-label={t("selector.searchAria")}
            />
          </div>
          <ul
            role="listbox"
            aria-label={t("selector.aria")}
            className="max-h-48 overflow-y-auto py-1"
          >
            {filteredLanguages.map((language) => (
              <li
                key={language.code}
                role="option"
                aria-selected={language.code === selectedLanguage?.code}
                onClick={() => handleSelect(language.code)}
                onKeyDown={(e) => e.key === "Enter" && handleSelect(language.code)}
                tabIndex={0}
                className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition hover:bg-slate-800 focus:bg-slate-800 focus:outline-none ${
                  language.code === selectedLanguage?.code
                    ? "bg-slate-800 font-semibold text-white"
                    : "text-slate-300"
                }`}
              >
                <span className="flex-1">{language.nativeLabel}</span>
                {language.code === selectedLanguage?.code && (
                  <span aria-hidden="true" className="text-blue-400">✓</span>
                )}
              </li>
            ))}
            {filteredLanguages.length === 0 && (
              <li className="px-3 py-2 text-sm text-slate-500">
                {searchValue}
              </li>
            )}
          </ul>
        </div>
      )}

      {/* "Make this default?" prompt */}
      {languagePromptPending && (
        <div
          role="dialog"
          aria-live="polite"
          className="mt-2 rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-3 py-3 text-xs"
        >
          <p className="font-semibold text-yellow-200">
            {t("selector.defaultPrompt")}
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => confirmLanguageDefault(true)}
              className="rounded-md bg-yellow-400 px-3 py-1 font-bold text-slate-950 transition hover:bg-yellow-300"
            >
              {t("selector.setDefault.yes")}
            </button>
            <button
              type="button"
              onClick={() => confirmLanguageDefault(false)}
              className="rounded-md border border-white/20 px-3 py-1 font-semibold text-white transition hover:bg-white/10"
            >
              {t("selector.setDefault.no")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
