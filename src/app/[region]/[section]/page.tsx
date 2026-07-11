import type { Metadata } from "next";
import { notFound } from "next/navigation";

import RegionalSectionPage from "@/components/regions/RegionalSectionPage";
import {
  REGION_SECTION_SLUGS,
  REQUIRED_GLOBAL_REGIONS,
  getGlobalRegionArchitecture,
  type RegionSectionSlug,
} from "@/lib/globalRegionArchitecture";

export function generateStaticParams() {
  return REQUIRED_GLOBAL_REGIONS.flatMap((region) =>
    REGION_SECTION_SLUGS.map((section) => ({
      region: region.slug,
      section,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string; section: string }>;
}): Promise<Metadata> {
  const { region, section } = await params;
  const regionConfig = getGlobalRegionArchitecture(region);

  if (!regionConfig || !REGION_SECTION_SLUGS.includes(section as RegionSectionSlug)) {
    return {};
  }

  return {
    title: `${regionConfig.name} ${section.replace("-", " ")} | Edunancial`,
    description: `${regionConfig.name} ${section.replace("-", " ")} architecture route.`,
  };
}

export default async function RegionSectionRoute({
  params,
}: {
  params: Promise<{ region: string; section: string }>;
}) {
  const { region, section } = await params;
  const regionConfig = getGlobalRegionArchitecture(region);

  if (!regionConfig || !REGION_SECTION_SLUGS.includes(section as RegionSectionSlug)) {
    notFound();
  }

  return (
    <RegionalSectionPage
      region={regionConfig}
      section={section as RegionSectionSlug}
    />
  );
}
