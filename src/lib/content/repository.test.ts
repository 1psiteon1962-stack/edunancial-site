import assert from "node:assert/strict";
import test from "node:test";

import {
  getFeaturedArticles,
  searchPublishedArticles,
} from "@/lib/content/repository";

test("filters published articles by category and author", () => {
  const results = searchPublishedArticles({
    category: "budgeting",
    author: "jordan-lee",
  });

  assert.ok(results.length >= 1);
  assert.ok(results.every((article) => article.authorSlug === "jordan-lee"));
});

test("returns featured published content", () => {
  const featured = getFeaturedArticles();

  assert.ok(featured.length >= 1);
  assert.ok(featured.every((article) => article.featured));
});
