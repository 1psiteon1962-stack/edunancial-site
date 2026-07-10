import type { Metadata } from "next";

import type { LocalizedSEO } from "@/lib/i18n/cms-types";
import { getHtmlLang } from "@/lib/i18n/a11y";

export function generateLocalizedMetadata(
  seo: LocalizedSEO,
  locale: string
): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonicalUrl,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      locale: getHtmlLang(locale).replace("-", "_"),
      url: seo.canonicalUrl,
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    twitter: {
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  };
}
