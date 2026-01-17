"use client";

import { Language } from "@/lib/i18n";

const LABELS: Record<Language, string> = {
  en: "English",
  es: "Español",
  ar: "العربية",
};

export default function LanguageToggle(props: {
  language: Language;
  onChange: (lang: Language) => void;
}) {
  return (
    <select
      value={props.language}
      onChange={(e) => props.onChange(e.target.value as Language)}
      style={{ padding: "6px 10px" }}
    >
      {Object.entries(LABELS).map(([code, label]) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  );
}
