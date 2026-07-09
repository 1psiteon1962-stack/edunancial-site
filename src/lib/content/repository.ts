import {
  contentArticles,
  contentAuthors,
  contentCategories,
  topicClusters,
} from "@/data/content-platform";
import { generateAISuggestions } from "@/lib/content/ai";
import { estimateReadingTime, getSeoScore } from "@/lib/content/seo";
import type {
  AIReviewItem,
  ContentArticle,
  ContentCategory,
  ContentSearchFilters,
  TopicCluster,
} from "@/lib/content/types";

function sortByPublishedDate(articles: ContentArticle[]) {
  return [...articles].sort((left, right) => {
    const leftDate = left.publishedAt ?? left.scheduledFor ?? left.updatedAt;
    const rightDate = right.publishedAt ?? right.scheduledFor ?? right.updatedAt;
    return new Date(rightDate).getTime() - new Date(leftDate).getTime();
  });
}

export function getAllArticles(): ContentArticle[] {
  return [...contentArticles];
}

export function getPublishedArticles(): ContentArticle[] {
  return sortByPublishedDate(contentArticles.filter((article) => article.status === "published"));
}

export function getArticleBySlug(slug: string): ContentArticle | undefined {
  return contentArticles.find((article) => article.slug === slug);
}

export function getPublishedArticleBySlug(slug: string): ContentArticle | undefined {
  return getPublishedArticles().find((article) => article.slug === slug);
}

export function getAuthorBySlug(slug: string) {
  return contentAuthors.find((author) => author.slug === slug);
}

export function getCategoryBySlug(slug: string): ContentCategory | undefined {
  return contentCategories.find((category) => category.slug === slug);
}

export function getClusterBySlug(slug: string): TopicCluster | undefined {
  return topicClusters.find((cluster) => cluster.slug === slug);
}

export function getAllTags(): string[] {
  return Array.from(new Set(contentArticles.flatMap((article) => article.tags))).sort();
}

export function searchPublishedArticles(filters: ContentSearchFilters): ContentArticle[] {
  return getPublishedArticles().filter((article) => {
    const query = filters.query?.trim().toLowerCase();
    const matchesQuery =
      !query ||
      [
        article.title,
        article.excerpt,
        article.summary,
        ...article.tags,
        ...article.entityHighlights,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

    const matchesCategory = !filters.category || article.categorySlug === filters.category || article.secondaryCategorySlugs.includes(filters.category);
    const matchesTag = !filters.tag || article.tags.includes(filters.tag);
    const matchesAuthor = !filters.author || article.authorSlug === filters.author;
    const matchesCluster = !filters.cluster || article.clusterSlug === filters.cluster;
    const matchesFeatured = !filters.featured || article.featured;
    const matchesTrending = !filters.trending || article.performance.trendingScore >= 75;

    return (
      matchesQuery &&
      matchesCategory &&
      matchesTag &&
      matchesAuthor &&
      matchesCluster &&
      matchesFeatured &&
      matchesTrending
    );
  });
}

export function getFeaturedArticles() {
  return getPublishedArticles().filter((article) => article.featured);
}

export function getTrendingArticles() {
  return getPublishedArticles().filter((article) => article.performance.trendingScore >= 75);
}

export function getRelatedArticles(article: ContentArticle): ContentArticle[] {
  const explicitMatches = (article.relatedSlugs ?? [])
    .map((slug) => getPublishedArticleBySlug(slug))
    .filter((entry): entry is ContentArticle => Boolean(entry));

  if (explicitMatches.length > 0) {
    return explicitMatches;
  }

  return getPublishedArticles()
    .filter((candidate) => candidate.slug !== article.slug)
    .map((candidate) => {
      const overlap = candidate.tags.filter((tag) => article.tags.includes(tag)).length;
      const categoryBoost =
        candidate.categorySlug === article.categorySlug ||
        candidate.clusterSlug === article.clusterSlug
          ? 2
          : 0;

      return { candidate, score: overlap + categoryBoost };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((entry) => entry.candidate);
}

export function getArticleReadingTime(article: ContentArticle): number {
  return estimateReadingTime(article);
}

export function getArticleSuggestions(article: ContentArticle): AIReviewItem[] {
  return generateAISuggestions(
    article,
    getRelatedArticles(article).map((related) => related.slug)
  );
}

export function getEditorialDashboardSnapshot() {
  const articles = getAllArticles();
  const counts = articles.reduce<Record<string, number>>((accumulator, article) => {
    accumulator[article.status] = (accumulator[article.status] ?? 0) + 1;
    return accumulator;
  }, {});

  const seoAlerts = articles
    .map((article) => ({ article, seoScore: getSeoScore(article) }))
    .filter((entry) => entry.seoScore < 85)
    .sort((left, right) => left.seoScore - right.seoScore);

  return {
    articles,
    counts,
    seoAlerts,
    scheduledQueue: sortByPublishedDate(articles.filter((article) => article.status === "scheduled")),
    approvalQueue: sortByPublishedDate(
      articles.filter((article) => article.status === "inReview" || article.status === "approved")
    ),
  };
}

export function getPublishedArticlesByAuthor(authorSlug: string) {
  return getPublishedArticles().filter((article) => article.authorSlug === authorSlug);
}

export function getPublishedArticlesByCategory(categorySlug: string) {
  return getPublishedArticles().filter(
    (article) => article.categorySlug === categorySlug || article.secondaryCategorySlugs.includes(categorySlug)
  );
}

export function getPublishedArticlesByCluster(clusterSlug: string) {
  return getPublishedArticles().filter((article) => article.clusterSlug === clusterSlug);
}

export function getLibraryTaxonomy() {
  return {
    categories: [...contentCategories].sort((left, right) => left.priority - right.priority),
    clusters: topicClusters,
    authors: contentAuthors,
    tags: getAllTags(),
  };
}
