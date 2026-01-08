// app/[region]/page.tsx

import { notFound } from "next/navigation";
import { REGIONS } from "@/data/regions";
import { REGION_CONTENT } from "@/data/regionContent";

interface PageProps {
  params: {
    region: string;
  };
}

export default function RegionPage({ params }: PageProps) {
  const regionKey = params.region;

  // Direct object lookup (safe, typed, no array misuse)
  const regionMeta = REGIONS[regionKey];
  const content = REGION_CONTENT[regionKey];

  if (!regionMeta || !content || !regionMeta.enabled) {
    notFound();
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "800px" }}>
      <h1>{regionMeta.name}</h1>
      <p style={{ opacity: 0.8 }}>{regionMeta.description}</p>

      <hr style={{ margin: "2rem 0" }} />

      <h2>{content.headline}</h2>
      <p>{content.body}</p>

      <hr style={{ margin: "2rem 0" }} />

      <p>
        <strong>Supported languages:</strong>{" "}
        {regionMeta.languages.join(", ")}
      </p>
    </main>
  );
}
