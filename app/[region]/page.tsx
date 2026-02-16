// app/[region]/page.tsx

import { notFound } from "next/navigation";
import { regions } from "@/lib/regions";

interface PageProps {
  params: {
    region: string;
  };
}

export default function RegionPage({ params }: PageProps) {
  const region = regions.find(r => r.slug === params.region);

  if (!region) {
    notFound();
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>{region.name}</h1>

      <ul>
        {region.clientModules.map((mod) => (
          <li key={mod}>{mod}</li>
        ))}
      </ul>
    </main>
  );
}

/**
 * REQUIRED for static generation
 */
export function generateStaticParams() {
  return regions.map((r) => ({
    region: r.slug,
  }));
}
