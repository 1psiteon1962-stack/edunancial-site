import { MetadataRoute } from "next";
import { REQUIRED_GLOBAL_REGIONS, REGION_SECTION_SLUGS } from "@/lib/globalRegionArchitecture";

const BASE_URL = "https://www.edunancial.com";

const CORE_ROUTES = [
  "",
  "/about",
  "/courses",
  "/membership",
  "/levels",
  "/sponsor",
  "/contact",
  "/privacy",
  "/trust-center",
  "/security",
  "/disclaimer",
  "/terms",
  "/refund-policy",
  "/faq",
  "/assessment",
  "/why-edunancial",
];

const LATAM_COUNTRY_ROUTES = [
  "/latin-america",
  "/latin-america/mexico",
  "/latin-america/colombia",
  "/latin-america/brazil",
  "/latin-america/argentina",
  "/latin-america/peru",
  "/latin-america/chile",
  "/latin-america/central-america",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const coreEntries: MetadataRoute.Sitemap = CORE_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const latamCountryEntries: MetadataRoute.Sitemap = LATAM_COUNTRY_ROUTES.map(
    (route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  const regionalEntries: MetadataRoute.Sitemap = REQUIRED_GLOBAL_REGIONS.flatMap(
    (region) => {
      const regionRoot: MetadataRoute.Sitemap[0] = {
        url: `${BASE_URL}/${region.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      };
      const sectionEntries: MetadataRoute.Sitemap = REGION_SECTION_SLUGS.map(
        (section) => ({
          url: `${BASE_URL}/${region.slug}/${section}`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })
      );
      return [regionRoot, ...sectionEntries];
    }
  );

  return [...coreEntries, ...latamCountryEntries, ...regionalEntries];
}
