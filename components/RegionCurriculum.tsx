// components/RegionCurriculum.tsx

import { regionContent } from "@/data/regionContent";

type Props = {
  regionKey: string;
  lang: string;
};

export default function RegionCurriculum({ regionKey, lang }: Props) {
  const region = regionContent[regionKey];
  const content = region.languages[lang] ?? region.languages["en"];

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
      <p className="mb-6">{content.description}</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Curriculum</h2>
        <ul className="list-disc ml-6 space-y-1">
          {content.curriculum.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Pricing</h2>
        <p className="text-lg font-bold">{content.pricing}</p>
      </section>
    </main>
  );
}
