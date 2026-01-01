// components/LocalizedDoctrine.tsx

import { Language } from "@/lib/i18n";
import { content as en } from "@/data/content.en";
import { content as es } from "@/data/content.es";
import { regionContent } from "@/data/regionContent";

const languageMap = { en, es };

export default function LocalizedDoctrine({
  lang,
  region,
}: {
  lang: Language;
  region: "africa" | "asia" | "europe" | "mena";
}) {
  const base = languageMap[lang];
  const regional = regionContent[region][lang];

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">
        {regional.title || base.doctrineTitle}
      </h2>
      <p className="text-lg">{regional.body || base.doctrineBody}</p>
    </section>
  );
}
