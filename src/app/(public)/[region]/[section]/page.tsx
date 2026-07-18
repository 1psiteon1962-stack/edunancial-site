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

  const formattedSection = section.replace("-", " ");
  const routePath = `/${regionConfig.slug}/${section}`;
  const title = `${regionConfig.name} ${formattedSection} | Edunancial`;

  return {
    title,
    description: `${regionConfig.name} ${formattedSection} architecture route.`,
    alternates: {
      canonical: routePath,
    },
    openGraph: {
      title,
      description: `${regionConfig.name} ${formattedSection} architecture route.`,
      url: routePath,
      locale: regionConfig.locale,
      type: "website",
    },
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
