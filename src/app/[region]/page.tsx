import type { Metadata } from "next";
import { notFound } from "next/navigation";

import RegionalLandingPage from "@/components/regions/RegionalLandingPage";
import {
  REQUIRED_GLOBAL_REGIONS,
  getGlobalRegionArchitecture,
} from "@/lib/globalRegionArchitecture";

export function generateStaticParams() {
  return REQUIRED_GLOBAL_REGIONS.map((region) => ({ region: region.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  const regionConfig = getGlobalRegionArchitecture(region);

  if (!regionConfig) {
    return {};
  }

  return {
    title: `${regionConfig.name} | Edunancial`,
    description: regionConfig.description,
  };
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const regionConfig = getGlobalRegionArchitecture(region);

  if (!regionConfig) {
    notFound();
  }

  return <RegionalLandingPage region={regionConfig} />;
}
