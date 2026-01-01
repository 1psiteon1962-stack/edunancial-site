import { content as en } from "@/data/content.en";
import { content as es } from "@/data/content.es";
import { Language, resolveCopy } from "@/lib/i18n";

const contentMap = { en, es };

export default function LocalizedDoctrine({ lang }: { lang: Language }) {
  const c = resolveCopy(lang, contentMap);

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">{c.doctrineTitle}</h2>
      <p className="whitespace-pre-line">{c.doctrineBody}</p>
    </section>
  );
}
