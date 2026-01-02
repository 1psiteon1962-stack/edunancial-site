import { RegionCurriculumContent } from "@/lib/regionContent";
import { Language } from "@/lib/languages";

interface RegionCurriculumProps {
  regionKey: string;
  lang: Language;
  content: RegionCurriculumContent;
}

export default function RegionCurriculum({
  regionKey,
  lang,
  content,
}: RegionCurriculumProps) {
  return (
    <section className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
      <p className="mb-4">{content.description}</p>

      <h2 className="text-xl font-semibold mb-2">Curriculum</h2>
      <ul className="list-disc ml-6 mb-6">
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
        <li>Enterprise: {content.pricing.currency} {content.pricing.enterprise}</li>
      </ul>
    </section>
  );
}
