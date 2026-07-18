import { notFound } from "next/navigation";

import RegionalRouteLayout from "@/components/regions/RegionalRouteLayout";
import { getGlobalRegionArchitecture } from "@/lib/globalRegionArchitecture";

export default async function RegionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const regionConfig = getGlobalRegionArchitecture(region);

  if (!regionConfig) {
    notFound();
  }

  return <RegionalRouteLayout region={regionConfig}>{children}</RegionalRouteLayout>;
}
