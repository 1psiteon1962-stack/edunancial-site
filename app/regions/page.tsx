// app/regions/page.tsx

import Link from "next/link";
import { REGIONS } from "@/data/regions";

export default function RegionsIndexPage() {
  const enabledRegions = Object.entries(REGIONS).filter(
    ([_, region]) => region.enabled
  );

  return (
    <main style={{ padding: "2rem", maxWidth: "900px" }}>
      <h1>Edunancial Global Regions</h1>

      <p style={{ opacity: 0.8 }}>
        Edunancial delivers region-specific entrepreneurship education,
        tailored to legal, financial, and cultural systems worldwide.
      </p>

      <ul style={{ marginTop: "2rem" }}>
        {enabledRegions.map(([key, region]) => (
          <li key={key} style={{ marginBottom: "1.5rem" }}>
            <h3>{region.name}</h3>
            <p>{region.description}</p>
            <Link href={`/${key}`}>
              → Explore {region.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
