import type { Metadata } from "next";
import { notFound } from "next/navigation";

import RegionalLandingPage from "@/components/regions/RegionalLandingPage";
import {
  REQUIRED_GLOBAL_REGIONS,
  getGlobalRegionArchitecture,
} from "@/lib/globalRegionArchitecture";

const BASE_URL = "https://www.edunancial.com";

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

  const canonicalUrl = `${BASE_URL}/${regionConfig.slug}`;
  const hreflangEntries = Object.fromEntries(
    regionConfig.supportedLanguages.map((lang) => [lang, canonicalUrl])
  );

  return {
    title: `${regionConfig.name} | Edunancial`,
    description: regionConfig.description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...hreflangEntries,
        "x-default": canonicalUrl,
      },
    },
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
