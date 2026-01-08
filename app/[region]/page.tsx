// app/[region]/page.tsx

import { notFound } from "next/navigation";
import { REGIONS, RegionCode } from "@/lib/regions.config";

interface PageProps {
  params: {
    region: RegionCode;
  };
}

export default function RegionPage({ params }: PageProps) {
  const region = REGIONS[params.region];

  if (!region || !region.enabled) {
    notFound();
  }

  return (
    <main style={{ padding: "3rem", maxWidth: "960px", margin: "0 auto" }}>
      <h1>Edunancial</h1>

      <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
        Education focused on readiness, structure, and long-term business durability.
      </p>

      <p style={{ marginTop: "0.75rem", color: "#555" }}>
        The platform is live. Global rollout is in progress.
      </p>

      <section style={{ marginTop: "3rem" }}>
        <h2>{region.name}</h2>
        <p style={{ marginTop: "0.5rem" }}>
          This regional site reflects Edunancial’s deployment model, curriculum
          structure, and market-specific readiness requirements.
        </p>
      </section>
    </main>
  );
}
