// app/latam/[lang]/page.tsx

import { notFound } from "next/navigation";

/**
 * Supported languages for LATAM mirror
 */
const SUPPORTED_LANGUAGES = ["es", "en"] as const;
type Lang = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Required for static export
 */
export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default function LatamPage({
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
      <h1>Edunancial — Latin America</h1>

      <p>
        The Latin America mirror focuses on capital access, informal-to-formal
        transition, currency risk, entrepreneurship under constraint, and
        regional scaling realities.
      </p>

      <p>
        Content is designed for founders and operators navigating volatility,
        limited institutional support, and fragmented financial systems.
      </p>

      <p>
        Edunancial provides structural clarity — helping users evaluate paths to
        stability, growth, and cross-border opportunity.
      </p>

      <p>
        Language selected: <strong>{lang.toUpperCase()}</strong>
      </p>

      <footer style={{ marginTop: "4rem", fontSize: "0.85rem", opacity: 0.7 }}>
        <p>
          All intellectual property is owned by Caban International Holdings,
          Inc. and licensed regionally.
        </p>
      </footer>
    </main>
  );
}
