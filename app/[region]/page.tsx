import { notFound } from "next/navigation";
import { REGIONS } from "@/data/regions";
import { REGION_CONTENT } from "@/data/regionContent";

interface PageProps {
  params: {
    region: string;
  };
}

export default function RegionPage({ params }: PageProps) {
  const regionSlug = params.region;

  // REGIONS is an object map → use entries to match slug
  const regionEntry = Object.entries(REGIONS).find(
    ([slug]) => slug === regionSlug
  );

  if (!regionEntry) {
    notFound();
  }

  const [, regionConfig] = regionEntry;

  const content = REGION_CONTENT[regionSlug];

  if (!content) {
    notFound();
  }

  return (
    <main>
      <h1>{regionConfig.name}</h1>
      <p>{content.description}</p>
    </main>
  );
}
