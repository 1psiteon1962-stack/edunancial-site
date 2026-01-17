"use client";

import { useState } from "react";
import { Language, DEFAULT_LANGUAGE, t } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";

export default function USHomePage() {
  const [lang, setLang] = useState<Language>(DEFAULT_LANGUAGE);

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <LanguageToggle onChange={setLang} />
      </div>

      <h1 style={{ fontSize: 36, fontWeight: 800, marginTop: 40 }}>
        {t("heroTitle", lang)}
      </h1>

      <p style={{ fontSize: 18, maxWidth: 640 }}>
        {t("heroSubtitle", lang)}
      </p>

      <section style={{ marginTop: 60 }}>
        <h2 style={{ color: "#c0392b" }}>{t("redTitle", lang)}</h2>
        <p>{t("redDesc", lang)}</p>

        <h2 style={{ color: "#7f8c8d", marginTop: 30 }}>
          {t("whiteTitle", lang)}
        </h2>
        <p>{t("whiteDesc", lang)}</p>

        <h2 style={{ color: "#2980b9", marginTop: 30 }}>
          {t("blueTitle", lang)}
        </h2>
        <p>{t("blueDesc", lang)}</p>
      </section>

      <footer
        style={{
          marginTop: 80,
          paddingTop: 20,
          borderTop: "1px solid #ddd",
          fontSize: 12,
          color: "#555",
        }}
      >
        {t("disclaimer", lang)}
      </footer>
    </main>
  );
}
