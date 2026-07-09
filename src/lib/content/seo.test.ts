import assert from "node:assert/strict";
import test from "node:test";

import { getArticleBySlug } from "@/lib/content/repository";
import {
  buildArticleStructuredData,
  estimateReadingTime,
  getSeoScore,
} from "@/lib/content/seo";

const article = getArticleBySlug("credit-freeze-fraud-toolkit");
const relatedArticle = getArticleBySlug("cash-flow-basics-first-budget-system");
const author = article ? { slug: "jordan-lee", name: "Jordan Lee", title: "Senior Education Strategist", bio: "", expertise: [], credentials: [], locale: "en-US" } : null;

if (!article || !relatedArticle || !author) {
  throw new Error("Expected fixture articles for SEO tests.");
}

test("computes reading time and SEO score for published content", () => {
  assert.ok(estimateReadingTime(article) >= 3);
  assert.ok(getSeoScore(article) >= 85);
});

test("includes FAQ and breadcrumb structured data", () => {
  const structuredData = buildArticleStructuredData(article, author, [relatedArticle]);
  const types = structuredData.map((entry) => entry["@type"]);

  assert.ok(types.some((value) => Array.isArray(value) && value.includes("BlogPosting")));
  assert.ok(types.includes("BreadcrumbList"));
  assert.ok(types.includes("FAQPage"));
});
