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

  const routePath = `/${regionConfig.slug}`;
  const title = `${regionConfig.name} | Edunancial`;

  return {
    title,
    description: regionConfig.description,
    alternates: {
      canonical: routePath,
    },
    keywords: [
      regionConfig.name,
      "Edunancial",
      "regional routing",
      "localized pricing",
      "privacy and legal",
    ],
    openGraph: {
      title,
      description: regionConfig.description,
      url: routePath,
      locale: regionConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: regionConfig.description,
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
