import Link from "next/link";
import { regions } from "@/lib/regions";

export default function RegionNav() {
  return (
    <nav>
      <ul>
        {regions.map(region => (
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
