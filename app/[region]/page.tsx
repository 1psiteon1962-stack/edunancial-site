// app/[region]/page.tsx

import { REGIONS, RegionCode } from "@/lib/regions.config";
import { notFound } from "next/navigation";

export default function RegionPage({
  params,
}: {
  params: { region: RegionCode };
}) {
  const region = REGIONS[params.region];

  if (!region || !region.enabled) {
    notFound();
  }

  return (
    <main
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        padding: "4rem 2rem",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
        Edunancial
      </h1>

      <p style={{ fontSize: "1.15rem", marginBottom: "0.75rem" }}>
        Education focused on readiness, structure, and long-term business durability.
      </p>

      <p style={{ color: "#555", marginBottom: "3rem" }}>
        The platform is live. Global rollout is in progress.
      </p>

      <section>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          {region.name}
        </h2>
        <p>
          This regional deployment reflects market structure, regulatory reality,
          and operational readiness requirements.
        </p>
      </section>
    </main>
  );
}
