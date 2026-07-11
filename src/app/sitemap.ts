import { LATAM_REGION_CONFIG } from "@/lib/regions/latam/config";
import { generateRegionalSitemapEntries } from "@/lib/global/seo-framework";

const CORE_URLS = [
  "https://www.edunancial.com",
  "https://www.edunancial.com/about",
  "https://www.edunancial.com/courses",
  "https://www.edunancial.com/membership",
  "https://www.edunancial.com/levels",
  "https://www.edunancial.com/sponsor",
  "https://www.edunancial.com/contact",
  "https://www.edunancial.com/privacy",
  "https://www.edunancial.com/trust-center",
  "https://www.edunancial.com/security",
  "https://www.edunancial.com/disclaimer",
  "https://www.edunancial.com/terms",
  "https://www.edunancial.com/refund-policy",
  "https://www.edunancial.com/faq",
  "https://www.edunancial.com/assessment",
  "https://www.edunancial.com/why-edunancial",
];

export default function sitemap() {
  const lastModified = new Date();

  const coreEntries = CORE_URLS.map((url) => ({ url, lastModified }));

  // LATAM sitemap entries — only included when launch status is ACTIVE
  const latamEntries = generateRegionalSitemapEntries(
    {
      regionSlug: LATAM_REGION_CONFIG.slug,
      regionName: LATAM_REGION_CONFIG.name,
      defaultLanguage: LATAM_REGION_CONFIG.defaultLanguage,
      localeRoutes: {
        "es": "/latam",
        "pt": "/latam",
        "en": "/latam",
      },
      launchStatus: LATAM_REGION_CONFIG.launchControl.regionStatus,
    },
    lastModified
  );

  return [...coreEntries, ...latamEntries];
}
