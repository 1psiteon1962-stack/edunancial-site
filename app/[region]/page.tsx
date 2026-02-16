// app/[region]/page.tsx

import { notFound } from "next/navigation";
import { regions } from "@/lib/regions";

export default function RegionPage({
  params,
}: {
  params: { region: string };
}) {
  const region = regions.find((r) => r.slug === params.region);

  if (!region) notFound();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>{region.name}</h1>
      <ul>
        {(region.clientModules ?? []).map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </main>
  );
}

export function generateStaticParams() {
  return regions.map((r) => ({ region: r.slug }));
}
