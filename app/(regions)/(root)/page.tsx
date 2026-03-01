import { notFound } from "next/navigation";
import { getActiveRegion } from "@/lib/regions/getActiveRegion";

export default function RootRegionPage() {
  const regionKey =
    process.env.NEXT_PUBLIC_REGION ||
    process.env.SITE_REGION ||
    "us"; // hard fallback

  const region = getActiveRegion(regionKey);

  if (!region) {
    return notFound();
  }

  const { clientModules, ...rest } = region;

  return (
    <main style={{ padding: "2rem" }}>
      <h1>{region.name}</h1>
      <p>Active region: {regionKey}</p>
    </main>
  );
}
