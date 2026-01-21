"use client";

import { Language } from "@/lib/i18n";

interface Props {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function LanguageToggle({ language, setLanguage }: Props) {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <button
        onClick={() => setLanguage("en")}
        disabled={language === "en"}
      >
        EN
      </button>

      <button
        onClick={() => setLanguage("es")}
        disabled={language === "es"}
      >
        ES
      </button>
    </div>
  );
}
