// app/eu/[lang]/page.tsx

import { notFound } from "next/navigation";

const SUPPORTED_LANGUAGES = ["en", "fr", "de"] as const;
type Lang = (typeof SUPPORTED_LANGUAGES)[number];

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
        This regional mirror focuses on operating within highly regulated,
        multi-jurisdictional markets where compliance, durability, and capital
        efficiency determine long-term success.
      </p>

      <p>
        Content addresses enterprise structure, cross-border operations,
        taxation friction, labor constraints, and scale under legal symmetry.
      </p>

      <p>
        Edunancial provides analytical frameworks only — not advice — enabling
        users to understand trade-offs inherent to European business systems.
      </p>

      <p>
        Language selected: <strong>{lang.toUpperCase()}</strong>
      </p>

      <footer style={{ marginTop: "4rem", fontSize: "0.85rem", opacity: 0.7 }}>
        <p>
          Intellectual property owned by Caban International Holdings, Inc. and
          licensed for regional presentation.
        </p>
      </footer>
    </main>
  );
}
