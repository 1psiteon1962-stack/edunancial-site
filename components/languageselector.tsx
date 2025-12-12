"use client";

import { useRouter } from "next/navigation";

export default function LanguageSelector() {
  const router = useRouter();

  const changeLanguage = (lang: string) => {
    router.push(`/${lang}`);
  };

  return (
    <div className="flex gap-3 text-sm">
      <button onClick={() => changeLanguage("en")} className="underline">
        EN
      </button>
      <button onClick={() => changeLanguage("es")} className="underline">
        ES
      </button>
    </div>
  );
}
