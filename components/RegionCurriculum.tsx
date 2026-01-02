import { RegionCurriculumContent } from '@/lib/types';
import { Language } from '@/lib/language';

interface Props {
  regionKey: string;
  lang: Language;
  content: RegionCurriculumContent;
}

export default function RegionCurriculum({ content }: Props) {
  return (
    <section className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
      <p className="mb-4">{content.description}</p>

      <ul className="list-disc ml-6 mb-6">
        {content.curriculum.map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <div className="border p-4 rounded">
        <p>Monthly: {content.pricing.currency} {content.pricing.monthly}</p>
        <p>Quarterly: {content.pricing.currency} {content.pricing.quarterly}</p>
        <p>Annual: {content.pricing.currency} {content.pricing.annual}</p>
        <p>Lifetime: {content.pricing.currency} {content.pricing.lifetime}</p>
      </div>
    </section>
  );
}
