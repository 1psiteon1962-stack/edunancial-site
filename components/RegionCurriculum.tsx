// components/RegionCurriculum.tsx
import { RegionCurriculumContent } from '@/lib/regionContent';
import { Language } from '@/lib/language';

type Props = {
  regionKey: string;
  lang: Language;
  content: RegionCurriculumContent;
};

export default function RegionCurriculum({ content }: Props) {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
      <p className="mb-4">{content.description}</p>

      <ul className="list-disc ml-6 mb-6">
        {content.curriculum.map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <div className="border p-4 rounded">
        <p>Monthly: {content.pricing.currency} {content.pricing.monthly}</p>
        <p>Annual: {content.pricing.currency} {content.pricing.annual}</p>
        <p>Lifetime: {content.pricing.currency} {content.pricing.lifetime}</p>
      </div>
    </main>
  );
}
