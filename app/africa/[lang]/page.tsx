// app/africa/[lang]/page.tsx

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
  return REGION_LANGUAGES.AFRICA.map((lang) => ({
    lang,
  }));
}

export default function AfricaPage({ params }: Props) {
  const { lang } = params;

  const copy =
    resolveCopy("AFRICA", lang) ??
    resolveCopy("AFRICA", DEFAULT_LANGUAGE_BY_REGION.AFRICA);

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
    </main>
  );
}
