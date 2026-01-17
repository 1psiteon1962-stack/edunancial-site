"use client";

import { useState } from "react";

export default function LanguageToggle() {
  const [lang, setLang] = useState<"en" | "es">("en");

  return (
    <button
      onClick={() => setLang(lang === "en" ? "es" : "en")}
      style={{
        border: "1px solid #ccc",
        padding: "6px 12px",
        borderRadius: 4,
        cursor: "pointer",
        fontSize: 14
      }}
    >
      {lang === "en" ? "Español" : "English"}
    </button>
  );
}
