"use client";

import React from "react";

export type Language = "en" | "es" | "ar";

interface LanguageToggleProps {
  language: Language;
  onChange: React.Dispatch<React.SetStateAction<Language>>;
}

export default function LanguageToggle({
  language,
  onChange,
}: LanguageToggleProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange("en")}
        className={language === "en" ? "font-bold underline" : ""}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => onChange("es")}
        className={language === "es" ? "font-bold underline" : ""}
      >
        ES
      </button>

      <button
        type="button"
        onClick={() => onChange("ar")}
        className={language === "ar" ? "font-bold underline" : ""}
      >
        AR
      </button>
    </div>
  );
}
