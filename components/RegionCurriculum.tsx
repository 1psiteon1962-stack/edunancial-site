// components/RegionCurriculum.tsx

import { Language } from "@/lib/language";

export interface Pricing {
  currency: string;
  monthly: number;
  annual: number;
}

export interface RegionCurriculumContent {
  title: string;
  description: string;
  curriculum: string[];
  pricing: Pricing;
}

interface Props {
  regionKey: string;
  lang: Language;
  content: RegionCurriculumContent;
}

export default function RegionCurriculum({
  regionKey,
  lang,
  content,
}: Props) {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">
        {content.title} ({regionKey.toUpperCase()} · {lang})
      </h1>

      <p className="mb-6">{content.description}</p>

      <h2 className="text-xl font-semibold mb-2">Curriculum</h2>
      <ul className="list-disc ml-6 mb-6">
        {content.curriculum.map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Pricing</h2>
      <p>
        {content.pricing.currency} {content.pricing.monthly}/month or{" "}
        {content.pricing.currency} {content.pricing.annual}/year
      </p>
    </main>
  );
}
