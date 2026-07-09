import type { Metadata } from "next";

import { createSEO } from "@/lib/seo";
import type {
  AuthorProfile,
  ContentArticle,
  SeoChecklistItem,
} from "@/lib/content/types";

const SITE_URL = "https://www.edunancial.com";
const WORDS_PER_MINUTE = 220;

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function estimateReadingTime(article: ContentArticle): number {
  const wordCount = article.sections
    .flatMap((section) => [section.heading, section.summary, ...section.body])
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(3, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

export function buildCanonicalUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

export function buildTableOfContents(article: ContentArticle) {
  return article.sections.map((section) => ({
    id: section.id,
    heading: section.heading,
    summary: section.summary,
  }));
}

export function buildBreadcrumbs(article: ContentArticle): BreadcrumbItem[] {
  return [
    { name: "Blog", href: "/blog" },
    { name: article.categorySlug.replace(/-/g, " "), href: `/blog/categories/${article.categorySlug}` },
    { name: article.title, href: `/blog/${article.slug}` },
  ];
}

export function validateSeoReadiness(article: ContentArticle): SeoChecklistItem[] {
  const titleLength = article.seo.metaTitle.length;
  const descriptionLength = article.seo.metaDescription.length;
  const readingTime = estimateReadingTime(article);

  return [
    {
      label: "Meta title length",
      passed: titleLength >= 35 && titleLength <= 65,
      detail: `${titleLength} characters`,
    },
    {
      label: "Meta description length",
      passed: descriptionLength >= 110 && descriptionLength <= 170,
      detail: `${descriptionLength} characters`,
    },
    {
      label: "Canonical path present",
      passed: article.seo.canonicalPath.startsWith("/blog/"),
      detail: article.seo.canonicalPath,
    },
    {
      label: "Entity-first structure",
      passed: article.entityHighlights.length >= 3,
      detail: `${article.entityHighlights.length} entities highlighted`,
    },
    {
      label: "Question and answer coverage",
      passed: article.faq.length >= 2,
      detail: `${article.faq.length} FAQ entries`,
    },
    {
      label: "Scannable hierarchy",
      passed: article.sections.length >= 3,
      detail: `${article.sections.length} sections`,
    },
    {
      label: "Readable depth",
      passed: readingTime >= 3,
      detail: `${readingTime} minute estimate`,
    },
  ];
}

export function getSeoScore(article: ContentArticle): number {
  const checklist = validateSeoReadiness(article);
  const passed = checklist.filter((item) => item.passed).length;
  return Math.round((passed / checklist.length) * 100);
}

export function buildArticleMetadata(article: ContentArticle): Metadata {
  const base = createSEO(
    article.seo.metaTitle,
    article.seo.metaDescription,
    article.seo.canonicalPath
  );

  return {
    ...base,
    keywords: article.seo.keywords,
    category: article.categorySlug,
    authors: [{ name: article.authorSlug }],
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      images: [
        {
          url: article.seo.ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      ...base.twitter,
      images: [article.seo.ogImage],
    },
  };
}

export function buildArticleStructuredData(
  article: ContentArticle,
  author: AuthorProfile,
  relatedArticles: ContentArticle[]
) {
  const canonicalUrl = buildCanonicalUrl(article.seo.canonicalPath);

  return [
    {
      "@context": "https://schema.org",
      "@type": ["BlogPosting", "LearningResource"],
      headline: article.title,
      description: article.seo.metaDescription,
      url: canonicalUrl,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      educationalLevel: article.seo.educationalLevel,
      about: article.entityHighlights,
      keywords: article.seo.keywords.join(", "),
      author: {
        "@type": "Person",
        name: author.name,
        description: author.title,
        url: buildCanonicalUrl(`/authors/${author.slug}`),
      },
      publisher: {
        "@type": "Organization",
        name: "Edunancial",
        url: SITE_URL,
      },
      image: buildCanonicalUrl(article.seo.ogImage),
      hasPart: buildTableOfContents(article).map((item, index) => ({
        "@type": "WebPageElement",
        position: index + 1,
        name: item.heading,
      })),
      isPartOf: {
        "@type": "CollectionPage",
        name: "Edunancial Financial Education Library",
        url: buildCanonicalUrl("/blog"),
      },
      mentions: relatedArticles.map((related) => ({
        "@type": "CreativeWork",
        name: related.title,
        url: buildCanonicalUrl(`/blog/${related.slug}`),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: buildBreadcrumbs(article).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: buildCanonicalUrl(item.href),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: article.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];
}
