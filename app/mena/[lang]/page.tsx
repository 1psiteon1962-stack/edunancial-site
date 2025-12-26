import { notFound } from "next/navigation";
import { resolveCopy, Language, REGION_LANGUAGES } from "@/lib/i18n";

export async function generateStaticParams() {
  return [
    { lang: "ar" },
    { lang: "en" },
  ];
}

export default function Page({ params }: { params: { lang: Language } }) {
  const copy = resolveCopy("AFRICA", params.lang);

  if (!copy) notFound();

  return (
    <main
      dir={copy.dir}
      style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}
    >
      <h1>{copy.title} — MENA</h1>
      <h3>{copy.subtitle}</h3>
      <p>{copy.body}</p>
    </main>
  );
}
