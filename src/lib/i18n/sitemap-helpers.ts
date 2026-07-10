const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.edunancial.com";

export type SitemapEntry = {
  url: string;
  lastModified?: string | Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
  alternates?: {
    languages: Record<string, string>;
  };
};

function normalizeSlug(slug: string): string {
  if (!slug || slug === "/") {
    return "";
  }

  const trimmed = slug.replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "";
}

export function generateMultilingualSitemapEntries(
  slug: string,
  locales: string[]
): SitemapEntry[] {
  const normalizedSlug = normalizeSlug(slug);
  const alternates = Object.fromEntries(
    locales.map((locale) => [locale, `${baseUrl}/${locale}${normalizedSlug}`])
  );

  return locales.map((locale) => ({
    url: `${baseUrl}/${locale}${normalizedSlug}`,
    lastModified: new Date(),
    alternates: {
      languages: alternates,
    },
  }));
}
