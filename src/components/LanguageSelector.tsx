"use client";

import { useState, useEffect } from "react";
import { supportedLanguages } from "@/lib/i18n";

const languageNames: Record<string, { name: string; flag: string }> = {
  en: { name: "English", flag: "🇺🇸" },
  es: { name: "Español", flag: "🇪🇸" },
  fr: { name: "Français", flag: "🇫🇷" },
  pt: { name: "Português", flag: "🇵🇹" },
  de: { name: "Deutsch", flag: "🇩🇪" },
  it: { name: "Italiano", flag: "🇮🇹" },
  ar: { name: "العربية", flag: "🇸🇦" },
  ja: { name: "日本語", flag: "🇯🇵" },
  ko: { name: "한국어", flag: "🇰🇷" }
};

export default function LanguageSelector() {

  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("edunancial-language");

    if (saved && supportedLanguages.includes(saved as any)) {
      setLanguage(saved);
    }
  }, []);

  function changeLanguage(code: string) {

    setLanguage(code);

    localStorage.setItem(
      "edunancial-language",
      code
    );

    window.location.reload();

  }

  return (

    <select
      value={language}
      onChange={(e) => changeLanguage(e.target.value)}
      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
    >

      {supportedLanguages.map((code) => (

        <option
          key={code}
          value={code}
        >
          {languageNames[code]?.flag ?? "🌎"}{" "}
          {languageNames[code]?.name ?? code}
        </option>

      ))}

    </select>

  );

}
