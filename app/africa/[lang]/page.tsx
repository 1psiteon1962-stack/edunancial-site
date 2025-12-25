// app/africa/[lang]/page.tsx

import { notFound } from "next/navigation";

/**
 * Supported languages for Africa mirror
 * IMPORTANT:
 * - Must enumerate ALL languages at build time
 * - Required for `output: 'export'`
 */
const SUPPORTED_LANGUAGES = ["en", "fr", "pt"] as const;

type Lang = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * REQUIRED for Next.js static export
 * This is what fixed your Netlify failure.
 */
export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default function AfricaPage({
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
      <h1>Edunancial — Africa</h1>

      <p>
        Edunancial operates a global knowledge and infrastructure platform
        designed to help individuals, entrepreneurs, and organizations better
        understand how modern economic systems function in real-world
        environments.
      </p>

      <p>
        The Africa mirror focuses on market structure, capital formation,
        institutional readiness, and growth pathways specific to emerging and
        frontier economies across the continent.
      </p>

      <p>
        Rather than generalized instruction or advice, Edunancial deploys
        modular frameworks and reference models that can be localized and scaled
        to reflect regional realities while maintaining a consistent strategic
        core.
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
