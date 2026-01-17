"use client";

import { useState } from "react";
import LanguageToggle from "@/components/LanguageToggle";
import { Language, DEFAULT_LANGUAGE, t } from "@/lib/i18n";

export default function USHomePage() {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex justify-end">
        <LanguageToggle
          language={language}
          onChange={setLanguage}
        />
      </div>

      <header className="mt-8">
        <h1 className="text-4xl font-bold mb-4">
          {t("home.title", language)}
        </h1>
        <p className="text-lg text-gray-700">
          {t("home.subtitle", language)}
        </p>
      </header>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">
          {t("home.levels.title", language)}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className="border rounded-lg p-5 hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-2">
                {t(`levels.${level}.title`, language)}
              </h3>
              <p className="text-gray-700">
                {t(`levels.${level}.summary`, language)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold mb-6">
          {t("home.tracks.title", language)}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-5 bg-red-50">
            <h3 className="font-semibold text-lg mb-2">
              {t("tracks.red.title", language)}
            </h3>
            <p>{t("tracks.red.desc", language)}</p>
          </div>

          <div className="border rounded-lg p-5 bg-gray-50">
            <h3 className="font-semibold text-lg mb-2">
              {t("tracks.white.title", language)}
            </h3>
            <p>{t("tracks.white.desc", language)}</p>
          </div>

          <div className="border rounded-lg p-5 bg-blue-50">
            <h3 className="font-semibold text-lg mb-2">
              {t("tracks.blue.title", language)}
            </h3>
            <p>{t("tracks.blue.desc", language)}</p>
          </div>
        </div>
      </section>

      <section className="mt-16 text-center">
        <a
          href="/us/placement"
          className="inline-block bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition"
        >
          {t("home.cta", language)}
        </a>
      </section>
    </main>
  );
}
