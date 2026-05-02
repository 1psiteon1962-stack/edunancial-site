"use client";

import { usePathname, useRouter } from "next/navigation";
import { supportedLanguages } from "@/lib/i18n/languages";

const languageLabels: Record<string, string> = {
  en: "English",
  es: "Español",
};

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  function switchLanguage(languageCode: string) {
    const segments = pathname.split("/").filter(Boolean);

    if (segments[0] === "en" || segments[0] === "es") {
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
