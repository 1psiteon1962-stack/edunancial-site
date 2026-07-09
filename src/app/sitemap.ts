import type { MetadataRoute } from "next";

import {
  getLibraryTaxonomy,
  getPublishedArticles,
} from "@/lib/content/repository";

const siteUrl = "https://www.edunancial.com";

const staticRoutes = [
  "/",
  "/about",
  "/blog",
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
  "/refund",
  "/faq",
  "/assessment",
  "/why-edunancial",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const taxonomy = getLibraryTaxonomy();
  const articles = getPublishedArticles();

  return [
    ...staticRoutes.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
    })),
    ...articles.map((article) => ({
      url: `${siteUrl}/blog/${article.slug}`,
      lastModified: new Date(article.updatedAt),
    })),
    ...taxonomy.categories.map((category) => ({
      url: `${siteUrl}/blog/categories/${category.slug}`,
      lastModified: now,
    })),
    ...taxonomy.clusters.map((cluster) => ({
      url: `${siteUrl}/blog/clusters/${cluster.slug}`,
      lastModified: now,
    })),
    ...taxonomy.authors.map((author) => ({
      url: `${siteUrl}/authors/${author.slug}`,
      lastModified: now,
    })),
  ];
}
