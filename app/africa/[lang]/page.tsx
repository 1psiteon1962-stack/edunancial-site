import { notFound } from "next/navigation";

type Lang = "en" | "fr" | "pt";

/**
 * REQUIRED for `output: 'export'`
 * Netlify / Next must know ALL dynamic routes at build time.
 */
export async function generateStaticParams(): Promise<{ lang: Lang }[]> {
  return [
    { lang: "en" },
    { lang: "fr" },
    { lang: "pt" },
  ];
}

export default function AfricaLangPage({
  params,
}: {
  params: { lang: Lang };
}) {
  const { lang } = params;

  if (!["en", "fr", "pt"].includes(lang)) {
    notFound();
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Africa Platform</h1>

      <p>
        This regional platform focuses on infrastructure literacy, capital
        readiness, and operational systems relevant to African markets.
      </p>

      <p>
        Content is localized by language while maintaining a consistent global
        strategic framework.
      </p>

      <p>
        <strong>Language:</strong> {lang.toUpperCase()}
      </p>
    </main>
  );
}
