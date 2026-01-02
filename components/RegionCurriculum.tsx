import { RegionCurriculumContent } from "@/lib/regionContent";

interface RegionCurriculumProps {
  regionKey: string;
  lang: string;
  content: RegionCurriculumContent;
}

export default function RegionCurriculum({
  regionKey,
  lang,
  content,
}: RegionCurriculumProps) {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
      <p className="mb-6 text-gray-700">{content.description}</p>

      <h2 className="text-xl font-semibold mb-2">Curriculum</h2>
      <ul className="list-disc ml-6 mb-8">
        {content.curriculum.map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Pricing</h2>
      <ul className="list-disc ml-6">
        <li>Monthly: {content.pricing.currency} {content.pricing.monthly}</li>
        <li>Quarterly: {content.pricing.currency} {content.pricing.quarterly}</li>
        <li>Annual: {content.pricing.currency} {content.pricing.annual}</li>
        <li>Lifetime: {content.pricing.currency} {content.pricing.lifetime}</li>
      </ul>
    </main>
  );
}
