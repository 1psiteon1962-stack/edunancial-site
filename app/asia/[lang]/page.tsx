// app/asia/[lang]/page.tsx

import { notFound } from "next/navigation";

/**
 * Supported languages for Asia mirror
 * Fully enumerated to satisfy Next.js static export
 */
const SUPPORTED_LANGUAGES = ["en", "zh", "hi"] as const;

type Lang = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * REQUIRED for output: 'export'
 */
export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default function AsiaPage({
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
      <h1>Edunancial — Asia</h1>

      <p>
        Edunancial supports Asia-facing markets through a modular global
        framework designed to adapt across diverse regulatory systems,
        currencies, growth stages, and economic models.
      </p>

      <p>
        This mirror emphasizes scalability, manufacturing logic, capital
        velocity, technology leverage, and the practical tradeoffs faced by
        founders and operators in high-growth and mixed-regulation environments.
      </p>

      <p>
        Rather than prescribing outcomes, Edunancial provides reference
        structures and strategic lenses that allow participants to understand
        how decisions ripple across supply chains, capital access, labor, and
        governance.
      </p>

      <p>
        Language selected: <strong>{lang.toUpperCase()}</strong>
      </p>

      <footer style={{ marginTop: "4rem", fontSize: "0.85rem", opacity: 0.7 }}>
        <p>
          Edunancial is operated under license from Caban International Holdings,
          Inc. All intellectual property is centrally held and regionally
          licensed.
        </p>
      </footer>
    </main>
  );
}
