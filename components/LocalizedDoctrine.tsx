// components/LocalizedDoctrine.tsx
import { content as en } from "@/data/content.en";
import { content as es } from "@/data/content.es";
import { Language } from "@/lib/i18n";

const contentMap = { en, es };

export default function LocalizedDoctrine({ lang }: { lang: Language }) {
  const c = contentMap[lang];

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{c.doctrineTitle}</h1>
      <pre className="whitespace-pre-wrap text-lg leading-relaxed">
        {c.doctrineBody}
      </pre>
    </section>
  );
}
