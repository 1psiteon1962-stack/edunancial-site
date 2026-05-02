"use client";

import { usePathname, useRouter } from "next/navigation";
import { supportedLanguages } from "../lib/i18n/languages";

const languageLabels: Record<string, string> = {
  en: "English",
  es: "Español",
  ko: "한국어",
  ja: "日本語",
  tl: "Tagalog",
  ar: "العربية",
  pt: "Português",
  fr: "Français",
};

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  function switchLanguage(languageCode: string) {
    const segments = pathname.split("/").filter(Boolean);

    if (
      segments[0] === "en" ||
      segments[0] === "es" ||
      segments[0] === "ko" ||
      segments[0] === "ja" ||
      segments[0] === "tl" ||
      segments[0] === "ar" ||
      segments[0] === "pt" ||
      segments[0] === "fr"
    ) {
      segments[0] = languageCode;
    } else {
      segments.unshift(languageCode);
    }

    router.push(`/${segments.join("/")}`);
  }

  return (
    <div>
      {supportedLanguages.map((language) => (
        <button
          key={language.code}
          type="button"
          onClick={() => switchLanguage(language.code)}
        >
          {languageLabels[language.code] ?? language.label}
        </button>
      ))}
    </div>
  );
}
