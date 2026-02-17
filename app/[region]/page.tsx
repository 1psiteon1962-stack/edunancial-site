import { notFound } from "next/navigation";
import { regions } from "@/lib/regions";

type PageProps = {
  params: {
    region: string;
  };
};

export default function RegionPage({ params }: PageProps) {
  const region = regions.find(r => r.slug === params.region);

  if (!region) {
    notFound();
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>{region.name}</h1>
      <p>Region slug: {region.slug}</p>

      <h2>Modules</h2>
      <ul>
        {region.clientModules.map(mod => (
          <li key={mod}>{mod}</li>
        ))}
      </ul>
    </main>
  );
}
