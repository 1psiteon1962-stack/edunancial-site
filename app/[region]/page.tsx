import { notFound } from "next/navigation";
import { REGIONS } from "@/data/regions";
import { REGION_CONTENT } from "@/data/regionContent";

interface PageProps {
  params: { region: string };
}

export default function RegionPage({ params }: PageProps) {
  const regionKey = params.region;

  const regionMeta = REGIONS[regionKey];
  if (!regionMeta || !regionMeta.enabled) {
    notFound();
  }

  const content = REGION_CONTENT[regionKey as keyof typeof REGION_CONTENT];
  if (!content) {
    notFound();
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">{content.heroTitle}</h1>
      <p className="text-lg text-gray-600 mb-8">{content.heroSubtitle}</p>

      <section className="mb-10">
        {content.overview.map((p, i) => (
          <p key={i} className="mb-4 text-gray-800">
            {p}
          </p>
        ))}
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Core Focus Areas</h2>
        <ul className="list-disc pl-6 space-y-2">
          {content.focusAreas.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="text-sm text-gray-500 border-t pt-6">
        {content.disclaimer}
      </section>
    </main>
  );
}
