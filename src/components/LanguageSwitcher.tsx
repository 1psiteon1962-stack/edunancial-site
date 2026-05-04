"use client";

import { usePathname, useRouter } from "next/navigation";
import { supportedLanguages } from "@/lib/i18n/languages";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  function switchLanguage(languageCode: string) {
    const segments = pathname.split("/").filter(Boolean);

    const existingLanguage = supportedLanguages.some(
      (language) => language.code === segments[0]
    );

    if (existingLanguage) {
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
          {language.nativeLabel}
        </button>
      ))}
    </div>
  );
}
