import type { Metadata } from "next";

const SITE_URL = "https://edunancial.com";

function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function createSEO(title: string, description: string, path: string): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "Edunancial", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}
