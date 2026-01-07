import { notFound } from "next/navigation";
import { REGIONS } from "@/data/regions";
import { regionContent } from "@/data/regionContent";

interface PageProps {
  params: {
    region: string;
  };
}

export default function RegionPage({ params }: PageProps) {
  const regionSlug = params.region;

  const regionConfig = REGIONS.find(
    (r) => r.slug === regionSlug
  );

  if (!regionConfig) {
    return notFound();
  }

  const content = regionContent[regionSlug];

  if (!content) {
    return notFound();
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">
        {regionConfig.name}
      </h1>

      <p className="text-lg mb-8">
        {content.description}
      </p>

      {content.sections?.map((section, index) => (
        <section key={index} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            {section.title}
          </h2>
          <p className="text-base leading-relaxed">
            {section.body}
          </p>
        </section>
      ))}
    </main>
  );
}
