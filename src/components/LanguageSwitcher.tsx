"use client";

import { useRouter, usePathname } from "next/navigation";
import { supportedLanguages } from "@/lib/i18n/languages";

const languageLabels: Record<string, string> = {
  en: "English",
  es: "Español",
  ko: "한국어",
  ja: "日本語",
  tl: "Tagalog",
  ar: "العربية",
  pt: "Português",
  fr: "Français"
};

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const region = segments[0];
  const currentLang = segments[1];

  function switchLanguage(lang: string) {
    router.push(`/${region}/${lang}`);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ fontWeight: 600 }}>🌐 Language:</span>
      <select
        onChange={(e) => switchLanguage(e.target.value)}
        value={currentLang}
        style={{
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      >
        {supportedLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {languageLabels[lang]}
          </option>
        ))}
      </select>
    </div>
  );
}
