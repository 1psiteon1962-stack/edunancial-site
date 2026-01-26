// app/mena/[lang]/page.tsx

import { isLanguage } from "@/lib/i18n";
import { notFound } from "next/navigation";

type Props = {
  params: {
    lang: string;
  };
};

export default function MenaLangPage({ params }: Props) {
  if (!isLanguage(params.lang)) {
    return notFound();
  }

  const lang = params.lang;

  return (
    <main style={{ padding: "2rem" }}>
      <h1>MENA Region</h1>
      <p>Language: {lang}</p>
    </main>
  );
}
