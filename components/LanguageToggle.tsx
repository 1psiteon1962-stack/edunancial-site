"use client";

import { useState } from "react";
import { Language, DEFAULT_LANGUAGE } from "@/lib/i18n";

export default function LanguageToggle({
  onChange,
}: {
  onChange: (lang: Language) => void;
}) {
  const [lang, setLang] = useState<Language>(DEFAULT_LANGUAGE);

  function toggle() {
    const next = lang === "en" ? "es" : "en";
    setLang(next);
    onChange(next);
  }

  return (
    <button
      onClick={toggle}
      style={{
        border: "1px solid #ccc",
        padding: "6px 12px",
        borderRadius: 6,
        fontSize: 14,
        cursor: "pointer",
        background: "white",
      }}
    >
      {lang === "en" ? "Español" : "English"}
    </button>
  );
}
