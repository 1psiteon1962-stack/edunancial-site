import { notFound } from "next/navigation";
import { regions } from "@/lib/regions";

export const dynamic = "force-static";

export function generateStaticParams() {
  return regions.map((region) => ({
    region: region.slug,
  }));
}

export default function RegionPage({
  params,
}: {
  params: { region: string };
}) {
  const region = regions.find((r) => r.slug === params.region);

  if (!region) {
    notFound();
  }

  return (
    <main>
      <h1>{region.name}</h1>

      {region.clientModules?.map((Module, index) => (
        <Module key={index} />
      ))}
    </main>
  );
}
