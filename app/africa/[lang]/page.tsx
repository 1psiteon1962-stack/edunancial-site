import { notFound } from "next/navigation";
import {
  resolveCopy,
  REGION_LANGUAGES,
  DEFAULT_LANGUAGE,
  Language,
} from "@/lib/i18n";

export const dynamicParams = false;

export async function generateStaticParams() {
  return REGION_LANGUAGES.AFRICA.map((lang) => ({ lang }));
}

type Props = {
  params: { lang: Language };
};

export default function AfricaPage({ params }: Props) {
  const { lang } = params;

  if (!REGION_LANGUAGES.AFRICA.includes(lang)) {
    notFound();
  }

  const copy =
    resolveCopy("AFRICA", lang) ??
    resolveCopy("AFRICA", DEFAULT_LANGUAGE.AFRICA);

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
    </main>
  );
}
