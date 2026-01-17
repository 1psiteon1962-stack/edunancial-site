"use client";

import { useState } from "react";
import { Language, DEFAULT_LANGUAGE, t } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";

export default function USHomePage() {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>{t("site.title", language)}</h1>
        <LanguageToggle language={language} onChange={setLanguage} />
      </header>

      <p style={{ fontSize: 18, marginTop: 12 }}>
        {t("site.tagline", language)}
      </p>

      <section style={{ marginTop: 60 }}>
        <h2>Three Proven Paths to Wealth</h2>

        <div style={{ display: "grid", gap: 20, marginTop: 20 }}>
          <PathCard
            title={t("nav.real_estate", language)}
            description="Ownership, leverage, cash flow, and appreciation through property."
            color="#c0392b"
          />
          <PathCard
            title={t("nav.paper_assets", language)}
            description="Stocks, options, funds, and compounding capital markets."
            color="#ecf0f1"
          />
          <PathCard
            title={t("nav.business", language)}
            description="Building, owning, and scaling enterprises that produce income."
            color="#2980b9"
          />
        </div>
      </section>

      <section style={{ marginTop: 60 }}>
        <h2>What This Is — And What It Is Not</h2>
        <p>
          Edunancial provides financial literacy tools, frameworks, and
          decision-making education. It does not provide licensed investment,
          legal, tax, or financial advice.
        </p>
      </section>
    </main>
  );
}

function PathCard(props: {
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div
      style={{
        borderLeft: `6px solid ${props.color}`,
        padding: 20,
        background: "#fafafa",
      }}
    >
      <h3>{props.title}</h3>
      <p>{props.description}</p>
    </div>
  );
}
