import { notFound } from "next/navigation";
import { resolveCopy, Region, Language, REGION_LANGUAGES } from "@/lib/i18n";

export async function generateStaticParams() {
  return REGION_LANGUAGES.EU?.map((lang) => ({ lang })) ?? [
    { lang: "en" },
    { lang: "fr" },
  ];
}

export default function Page({ params }: { params: { lang: Language } }) {
  const copy = resolveCopy("AFRICA" as Region, params.lang); // reuse neutral copy

  if (!copy) notFound();

  return (
    <main
      dir={copy.dir}
      style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}
    >
      <h1>{copy.title} — Europe</h1>
      <h3>{copy.subtitle}</h3>
      <p>{copy.body}</p>
    </main>
  );
}
