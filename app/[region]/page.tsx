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

  // REGIONS is an object map, not an array → convert safely
  const regionConfig = Object.values(REGIONS).find(
    (r) => r.slug === regionSlug
  );

  if (!regionConfig) {
    notFound();
  }

  const content = regionContent[regionSlug as keyof typeof regionContent];

  if (!content) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">
          {content.heroTitle}
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          {content.description}
        </p>
      </header>

      <section className="grid gap-8">
        {content.sections.map((section) => (
          <div key={section.id} className="rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-2">
              {section.title}
            </h2>
            <p className="text-gray-700">
              {section.body}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
