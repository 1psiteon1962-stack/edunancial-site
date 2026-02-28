"use client";

import { useRouter, usePathname } from "next/navigation";
import { supportedLanguages } from "@/lib/i18n/languages";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const segments = pathname.split("/");
  const region = segments[1];

  function switchLanguage(lang: string) {
    router.push(`/${region}/${lang}`);
  }

  return (
    <select
      onChange={(e) => switchLanguage(e.target.value)}
      defaultValue={segments[2]}
    >
      {supportedLanguages.map((lang) => (
        <option key={lang} value={lang}>
          {lang.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
