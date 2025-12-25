// app/mena/[lang]/page.tsx

import { notFound } from "next/navigation";

const SUPPORTED_LANGUAGES = ["en", "ar"] as const;
type Lang = (typeof SUPPORTED_LANGUAGES)[number];

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default function MenaPage({
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
      <h1>Edunancial — Middle East & North Africa</h1>

      <p>
        This mirror focuses on capital concentration, family-office structures,
        sovereign influence, energy economics, and cross-border investment
        realities.
      </p>

      <p>
        Content emphasizes operating where regulatory discretion, political
        exposure, and capital velocity shape enterprise outcomes.
      </p>

      <p>
        Edunancial provides strategic literacy frameworks — not financial,
        legal, or investment advice.
      </p>

      <p>
        Language selected: <strong>{lang.toUpperCase()}</strong>
      </p>

      <footer style={{ marginTop: "4rem", fontSize: "0.85rem", opacity: 0.7 }}>
        <p>
          All content licensed from Caban International Holdings, Inc.
        </p>
      </footer>
    </main>
  );
}
