import { notFound } from "next/navigation";
import {
  resolveCopy,
  REGION_LANGUAGES,
  DEFAULT_LANGUAGE,
  Language,
} from "@/lib/i18n";

export const dynamicParams = false;

export async function generateStaticParams() {
  return REGION_LANGUAGES.LATAM.map((lang) => ({ lang }));
}

type Props = {
  params: { lang: Language };
};

export default function LatamPage({ params }: Props) {
  const { lang } = params;

  if (!REGION_LANGUAGES.LATAM.includes(lang)) {
    notFound();
  }

  const copy =
    resolveCopy("LATAM", lang) ??
    resolveCopy("LATAM", DEFAULT_LANGUAGE.LATAM);

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
      <h3>{copy.subtitle}</h3>
      <p>{copy.body}</p>

      <hr style={{ margin: "2rem 0" }} />

      <nav>
        <strong>Idioma / Language:</strong>{" "}
        {REGION_LANGUAGES.LATAM.map((l) => (
          <a
            key={l}
            href={`/latam/${l}`}
            style={{ marginRight: "1rem" }}
          >
            {l.toUpperCase()}
          </a>
        ))}
      </nav>
    </main>
  );
}
