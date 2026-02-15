import React from "react";
import Link from "next/link";
import { REGIONS } from "@/data/regions";

export default function RegionNav() {
  const regions = Object.values(REGIONS);

  return (
    <nav>
      <ul>
        {regions.map((region) => (
          <li key={region.code}>
            <Link href={`/${region.code}`}>
              {region.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
