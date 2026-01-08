// components/RegionNav.tsx

import Link from "next/link";
import { REGIONS } from "@/data/regions";

export default function RegionNav() {
  const enabledRegions = Object.entries(REGIONS).filter(
    ([_, region]) => region.enabled
  );

  return (
    <nav style={{ padding: "1rem 0", borderBottom: "1px solid #ddd" }}>
      <strong>Regions:</strong>{" "}
      {enabledRegions.map(([key, region], index) => (
        <span key={key}>
          <Link href={`/${key}`}>{region.name}</Link>
          {index < enabledRegions.length - 1 ? " | " : ""}
        </span>
      ))}
    </nav>
  );
}
