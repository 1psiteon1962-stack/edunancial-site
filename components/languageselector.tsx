"use client";

import { usePathname, useRouter } from "next/navigation";

export default function LanguageSelector() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLang = pathname.startsWith("/es") ? "es" : "en";

  const switchLanguage = (lang: "en" | "es") => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments[0] === "en" || segments[0] === "es") {
      segments[0] = lang;
    } else {
      segments.unshift(lang);
    }

    router.push("/" + segments.join("/"));
  };

  return (
    <div className="flex gap-2 text-sm">
      <button
        onClick={() => switchLanguage("en")}
        className={`px-2 py-1 rounded ${
          currentLang === "en" ? "font-bold underline" : ""
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage("es")}
        className={`px-2 py-1 rounded ${
          currentLang === "es" ? "font-bold underline" : ""
        }`}
      >
        ES
      </button>
    </div>
  );
}
