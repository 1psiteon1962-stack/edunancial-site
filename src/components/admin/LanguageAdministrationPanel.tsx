"use client";

import { useEffect, useMemo, useState } from "react";

import { useInternationalPreferences } from "@/components/international/InternationalPreferencesProvider";
import {
  getDefaultLanguageAdminSettings,
  getStoredLanguageAdminSettings,
  LANGUAGE_CATALOG,
  persistLanguageAdminSettings,
  type LanguageAdminSettings,
} from "@/lib/international/languages";
import { translatePlural } from "@/lib/international/i18n";

export default function LanguageAdministrationPanel() {
  const { preferences, t } = useInternationalPreferences();

  const [settings, setSettings] = useState<LanguageAdminSettings>(
    getDefaultLanguageAdminSettings()
  );

  useEffect(() => {
    setSettings(getStoredLanguageAdminSettings());
  }, []);

  useEffect(() => {
    persistLanguageAdminSettings(settings);
  }, [settings]);

  const languageRows = useMemo(() => {
    return LANGUAGE_CATALOG.map((language) => {
      const completeness = settings.translationCompleteness[language.code] ?? 0;
      const missing = Math.max(0, 100 - Math.round(completeness));

      return {
        language,
        enabled: settings.enabledLanguages.includes(language.code),
        isRtl: settings.rtlLanguages.includes(language.code),
        completeness,
        missing,
      };
    });
  }, [settings]);

  return (
    <main className="min-h-screen bg-[#08101f] p-10 text-white">
      <h1 className="text-5xl font-black">{t("admin.title")}</h1>
      <p className="mt-4 max-w-4xl text-slate-300">{t("admin.description")}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-300">{t("admin.defaultLanguage")}</span>
          <select
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
            value={settings.defaultLanguage}
            onChange={(event) =>
              setSettings((previous) => ({
                ...previous,
                defaultLanguage: event.target.value,
              }))
            }
          >
            {LANGUAGE_CATALOG.map((language) => (
              <option key={language.code} value={language.code}>
                {language.nativeLabel}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-slate-300">{t("admin.fallbackLanguage")}</span>
          <select
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2"
            value={settings.fallbackLanguage}
            onChange={(event) =>
              setSettings((previous) => ({
                ...previous,
                fallbackLanguage: event.target.value,
              }))
            }
          >
            {LANGUAGE_CATALOG.map((language) => (
              <option key={language.code} value={language.code}>
                {language.nativeLabel}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {languageRows.map((row) => (
          <article key={row.language.code} className="rounded-xl border border-slate-700 bg-slate-900/70 p-5">
            <h2 className="text-2xl font-bold">{row.language.nativeLabel}</h2>
            <p className="mt-1 text-sm text-slate-400">{row.language.code}</p>

            <label className="mt-4 flex items-center justify-between text-sm">
              <span>{t("admin.enable")}</span>
              <input
                type="checkbox"
                checked={row.enabled}
                onChange={(event) => {
                  setSettings((previous) => {
                    const enabledSet = new Set(previous.enabledLanguages);

                    if (event.target.checked) {
                      enabledSet.add(row.language.code);
                    } else {
                      enabledSet.delete(row.language.code);
                    }

                    return {
                      ...previous,
                      enabledLanguages: Array.from(enabledSet),
                    };
                  });
                }}
              />
            </label>

            <label className="mt-3 flex items-center justify-between text-sm">
              <span>{t("admin.rtl")}</span>
              <input
                type="checkbox"
                checked={row.isRtl}
                onChange={(event) => {
                  setSettings((previous) => {
                    const rtlSet = new Set(previous.rtlLanguages);

                    if (event.target.checked) {
                      rtlSet.add(row.language.code);
                    } else {
                      rtlSet.delete(row.language.code);
                    }

                    return {
                      ...previous,
                      rtlLanguages: Array.from(rtlSet),
                    };
                  });
                }}
              />
            </label>

            <label className="mt-3 block text-sm">
              <span>{t("admin.completeness")}: {row.completeness}%</span>
              <input
                type="range"
                min={0}
                max={100}
                value={row.completeness}
                onChange={(event) => {
                  const value = Number(event.target.value);

                  setSettings((previous) => ({
                    ...previous,
                    translationCompleteness: {
                      ...previous.translationCompleteness,
                      [row.language.code]: value,
                    },
                  }));
                }}
                className="mt-2 w-full"
              />
            </label>

            <p className="mt-3 text-sm text-slate-300">
              {translatePlural(preferences.preferredLanguage, "admin.missingTranslations", row.missing, {
                count: row.missing,
              })}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
