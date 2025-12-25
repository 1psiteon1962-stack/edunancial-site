// app/europe/[lang]/page.tsx

import { notFound } from "next/navigation";

/**
 * Supported languages for Europe mirror
 */
const SUPPORTED_LANGUAGES = ["en", "fr", "de"] as const;
type Lang = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Required for static export
 */
export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default function EuropePage({
  params,
}: {
  params: { lang: string };
}) {
  const lang = params.lang as Lang;

  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    notFound();
  }

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      <h1>Edunancial — Europe</h1>

      <p>
        The Europe mirror addresses regulated markets, cross-border compliance,
        capital efficiency, and durability-focused enterprise design.
      </p>

      <p>
        Emphasis is placed on long-term value creation within structured legal
        systems, tax regimes, labor protections, and multi-country operations.
      </p>

      <p>
        Edunancial frames tradeoffs between innovation, compliance, and scale —
        helping users understand where friction exists and how enterprises adapt.
      </p>

      <p>
        Language selected: <strong>{lang.toUpperCase()}</strong>
      </p>

      <footer style={{ marginTop: "4rem", fontSize: "0.85rem", opacity: 0.7 }}>
        <p>
          Edunancial operates under license from Caban International Holdings,
          Inc. Content is informational and non-advisory.
        </p>
      </footer>
    </main>
  );
}
