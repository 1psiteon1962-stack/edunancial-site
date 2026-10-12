import assert from "node:assert/strict";
import test from "node:test";
import { validateBlogArticlePackage } from "./article-package";
import { blogHreflang } from "./locale";

const valid = {
  schemaVersion: 1, slug: "compound-interest-basics", locale: "es-Caribbean",
  title: "Title", summary: "Summary", body: "Body", author: "Edunancial", track: "green",
  tags: ["compound-interest"], contentScope: "regional", targetRegion: "Caribbean",
  sources: [{ url: "https://example.com", title: "Source" }],
  provenance: { provider: "openai", createdAt: "2026-10-12T00:00:00Z" }, seo: {}
};

test("accepts a provider-neutral article package", () => {
  assert.deepEqual(validateBlogArticlePackage(valid), []);
});

test("maps internal Caribbean Spanish to standards-compliant hreflang", () => {
  assert.equal(blogHreflang("es-Caribbean"), "es-419");
});

test("requires geographic target for country/regional packages", () => {
  const broken = { ...valid, contentScope: "country", targetRegion: undefined };
  assert.match(validateBlogArticlePackage(broken).join(" "), /targetCountry/);
});
