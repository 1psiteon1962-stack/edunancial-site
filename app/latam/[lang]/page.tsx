// app/latam/[lang]/page.tsx

import { notFound } from "next/navigation";

/**
 * Supported languages for Latin America mirror
 * MUST be fully enumerated for static export
 */
const SUPPORTED_LANGUAGES = ["es", "pt", "en"] as const;

type Lang = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * REQUIRED for Next.js static export (`output: 'export'`)
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
        Edunancial operates a global knowledge and infrastructure platform
        designed to help individuals, entrepreneurs, and organizations better
        understand how modern economic systems function in real-world
        environments.
      </p>

      <p>
        The Latin America mirror focuses on capital access, informal-to-formal
        transition, cross-border commerce, currency dynamics, and scalable
        business structures across emerging and middle-income economies.
      </p>

      <p>
        Rather than generalized instruction or advice, Edunancial deploys
        modular frameworks and reference models that can be adapted, localized,
        and scaled to reflect regional market conditions while maintaining a
        consistent strategic core.
      </p>

      <p>
        Language selected: <strong>{lang.toUpperCase()}</strong>
      </p>

      <footer style={{ marginTop: "4rem", fontSize: "0.85rem", opacity: 0.7 }}>
        <p>
          Edunancial is a platform operated under license from Caban
          International Holdings, Inc.
        </p>
      </footer>
    </main>
  );
}
