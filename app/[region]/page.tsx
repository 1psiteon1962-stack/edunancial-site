import { notFound } from "next/navigation";
import { regions } from "@/lib/regions";
import { regionContent } from "@/lib/regionContent";
import RegionSection from "@/components/RegionSection";

type Props = {
  params: {
    region: string;
  };
};

export default function RegionPage({ params }: Props) {
  const regionKey = params.region;

  const regionConfig = regions.find(r => r.key === regionKey);
  if (!regionConfig) return notFound();

  const content = regionContent[regionKey];
  if (!content) return notFound();

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {content.heroTitle}
        </h1>
        <p className="text-lg text-gray-700">
          {content.description}
        </p>
      </header>

      {content.sections.map(section => (
        <RegionSection
          key={section.id}
          title={section.title}
          body={section.body}
        />
      ))}
    </main>
  );
}
