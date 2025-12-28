"use client";

import { usePathname, useRouter } from "next/navigation";

type Lang = "en" | "es";

export default function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();

  // Build-time and type safety: pathname CAN be null
  const safePath = pathname ?? "/";

  const currentLang: Lang = safePath.startsWith("/es") ? "es" : "en";

  const switchLanguage = (lang: Lang) => {
    // If pathname is null at runtime, do nothing safely
    if (!pathname) return;

    const segments = pathname.split("/").filter(Boolean);

    // Remove existing language prefix if present
    if (segments[0] === "en" || segments[0] === "es") {
      segments.shift();
    }

    const newPath =
      lang === "en"
        ? `/${segments.join("/")}`
        : `/es/${segments.join("/")}`;

    router.push(newPath || "/");
  };

  return (
    <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.9rem" }}>
      <button
        onClick={() => switchLanguage("en")}
        disabled={currentLang === "en"}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontWeight: currentLang === "en" ? 600 : 400,
          textDecoration: currentLang === "en" ? "underline" : "none",
        }}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage("es")}
        disabled={currentLang === "es"}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontWeight: currentLang === "es" ? 600 : 400,
          textDecoration: currentLang === "es" ? "underline" : "none",
        }}
      >
        ES
      </button>
    </div>
  );
}
