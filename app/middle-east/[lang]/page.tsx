// app/middle-east/[lang]/page.tsx

import { notFound } from "next/navigation";

/**
 * Supported languages for Middle East mirror
 */
const SUPPORTED_LANGUAGES = ["en", "ar"] as const;
type Lang = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Required for static export
 */
export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default function MiddleEastPage({
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
      <h1>Edunancial — Middle East</h1>

      <p>
        The Middle East mirror focuses on capital formation, sovereign influence,
        family-office structures, energy economics, and cross-border investment
        dynamics.
      </p>

      <p>
        Content emphasizes strategic positioning in environments where capital
        concentration, regulatory discretion, and geopolitical exposure shape
        decision-making.
      </p>

      <p>
        Edunancial provides analytical frameworks — not advice — enabling
        participants to evaluate opportunity, risk, and structure within
        regional realities.
      </p>

      <p>
        Language selected: <strong>{lang.toUpperCase()}</strong>
      </p>

      <footer style={{ marginTop: "4rem", fontSize: "0.85rem", opacity: 0.7 }}>
        <p>
          All intellectual property is owned by Caban International Holdings,
          Inc. and licensed for regional presentation.
        </p>
      </footer>
    </main>
  );
}
