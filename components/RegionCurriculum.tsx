import type { Language } from '@/lib/language';
import type { RegionCurriculumContent } from '@/lib/regionContent';

type Props = {
  regionKey: string;
  lang: Language;
  content: RegionCurriculumContent;
};

export default function RegionCurriculum({
  regionKey,
  lang,
  content,
}: Props) {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
      <p className="mb-6">{content.description}</p>

      <h2 className="text-xl font-semibold mb-2">Curriculum</h2>
      <ul className="list-disc ml-6 mb-6">
        {content.curriculum.map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Pricing</h2>
      <div>
        <p>
          {content.pricing.currency} {content.pricing.monthly} / month
        </p>
        <p>
          {content.pricing.currency} {content.pricing.annual} / year
        </p>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        Region: {regionKey} · Language: {lang}
      </div>
    </main>
  );
}
