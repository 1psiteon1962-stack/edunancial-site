// app/latam/[lang]/page.tsx

import { notFound } from "next/navigation";
import {
  resolveCopy,
  REGION_LANGUAGES,
  DEFAULT_LANGUAGE_BY_REGION,
  Language,
} from "@/lib/i18n";

type Props = {
  params: {
    lang: Language;
  };
};

export async function generateStaticParams() {
  return REGION_LANGUAGES.LATAM.map((lang) => ({
    lang,
  }));
}

export default function LatAmPage({ params }: Props) {
  const { lang } = params;

  // Spanish is default for LATAM, English allowed
  const copy =
    resolveCopy("LATAM", lang) ??
    resolveCopy("LATAM", DEFAULT_LANGUAGE_BY_REGION.LATAM);

  if (!copy) notFound();

  return (
    <main
      dir={copy.dir}
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <h1>{copy.title}</h1>
      <h2>{copy.subtitle}</h2>
      <p>{copy.body}</p>

      {/* Language switcher */}
      <nav style={{ marginTop: "2rem" }}>
        {REGION_LANGUAGES.LATAM.map((l) => (
          <a
            key={l}
            href={`/latam/${l}`}
            style={{
              marginRight: "1rem",
              fontWeight: l === lang ? "bold" : "normal",
            }}
          >
            {l.toUpperCase()}
          </a>
        ))}
      </nav>
    </main>
  );
}
