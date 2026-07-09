import Link from "next/link";
import type { Metadata } from "next";

import { ArticleCard } from "@/components/content/ArticleCard";
import { getSeoScore } from "@/lib/content/seo";
import {
  getFeaturedArticles,
  getLibraryTaxonomy,
  getTrendingArticles,
  searchPublishedArticles,
} from "@/lib/content/repository";
import { createSEO } from "@/lib/seo";

export const metadata: Metadata = createSEO(
  "Financial Education Blog & Content Library",
  "Explore Edunancial's AI-assisted financial education library with editorially approved articles, category filters, author pages, and SEO-rich learning resources.",
  "/blog"
);

type SearchParams = Record<string, string | string[] | undefined>;

function getValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const taxonomy = getLibraryTaxonomy();

  const filters = {
    query: getValue(resolvedSearchParams.query),
    category: getValue(resolvedSearchParams.category),
    tag: getValue(resolvedSearchParams.tag),
    author: getValue(resolvedSearchParams.author),
    cluster: getValue(resolvedSearchParams.cluster),
    featured: getValue(resolvedSearchParams.featured) === "true",
    trending: getValue(resolvedSearchParams.trending) === "true",
  };

  const articles = searchPublishedArticles(filters);
  const featuredArticles = getFeaturedArticles();
  const trendingArticles = getTrendingArticles();

  return (
    <main className="bg-[#08101f] text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-blue-300">Editorial publishing platform</p>
              <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                Financial education publishing built for scale, governance, and discoverability.
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-slate-300">
                Explore editorially approved financial education articles with strong topical clustering, entity-first structure, accessible metadata, and AI-assisted authoring workflows that never bypass human review.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-[#101a2f] p-6">
                <p className="text-sm text-slate-400">Published articles</p>
                <p className="mt-3 text-4xl font-black">{articles.length}</p>
                <p className="mt-3 text-sm text-slate-300">Search, filter, and browse the live library.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#101a2f] p-6">
                <p className="text-sm text-slate-400">SEO readiness</p>
                <p className="mt-3 text-4xl font-black">
                  {Math.round(
                    articles.reduce((total, article) => total + getSeoScore(article), 0) /
                      Math.max(1, articles.length)
                  )}
                </p>
                <p className="mt-3 text-sm text-slate-300">Average SEO quality score across live articles.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-[2rem] border border-white/10 bg-[#0d1729] p-6 md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-black">Advanced content library search</h2>
              <p className="mt-2 max-w-2xl text-slate-300">
                Filter by category, author, cluster, or tags to navigate the knowledge base and its educational content architecture.
              </p>
            </div>
            <Link
              href="/admin/content"
              className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Open editorial dashboard
            </Link>
          </div>

          <form className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4" role="search">
            <label className="text-sm text-slate-200">
              Search
              <input
                type="search"
                name="query"
                defaultValue={filters.query}
                placeholder="Search topics, entities, or tags"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#111d35] px-4 py-3 text-white"
              />
            </label>
            <label className="text-sm text-slate-200">
              Category
              <select
                name="category"
                defaultValue={filters.category ?? ""}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#111d35] px-4 py-3 text-white"
              >
                <option value="">All categories</option>
                {taxonomy.categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-200">
              Author
              <select
                name="author"
                defaultValue={filters.author ?? ""}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#111d35] px-4 py-3 text-white"
              >
                <option value="">All authors</option>
                {taxonomy.authors.map((author) => (
                  <option key={author.slug} value={author.slug}>
                    {author.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-200">
              Topic cluster
              <select
                name="cluster"
                defaultValue={filters.cluster ?? ""}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#111d35] px-4 py-3 text-white"
              >
                <option value="">All clusters</option>
                {taxonomy.clusters.map((cluster) => (
                  <option key={cluster.slug} value={cluster.slug}>
                    {cluster.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-200">
              Tag
              <select
                name="tag"
                defaultValue={filters.tag ?? ""}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#111d35] px-4 py-3 text-white"
              >
                <option value="">All tags</option>
                {taxonomy.tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111d35] px-4 py-3 text-sm text-slate-200">
              <input type="checkbox" name="featured" value="true" defaultChecked={filters.featured} className="h-4 w-4" />
              Featured only
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111d35] px-4 py-3 text-sm text-slate-200">
              <input type="checkbox" name="trending" value="true" defaultChecked={filters.trending} className="h-4 w-4" />
              Trending only
            </label>
            <div className="flex items-end gap-3">
              <button type="submit" className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500">
                Apply filters
              </button>
              <Link href="/blog" className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200 hover:text-white">
                Reset
              </Link>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-[#101a2f] p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black">Featured articles</h2>
              <span className="text-sm text-slate-400">Editorially curated</span>
            </div>
            <div className="mt-6 space-y-4">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-[#101a2f] p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black">Trending articles</h2>
              <span className="text-sm text-slate-400">Performance-aware selection</span>
            </div>
            <div className="mt-6 space-y-4">
              {trendingArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl font-black">Search results</h2>
          <p className="text-sm text-slate-400">{articles.length} published articles found</p>
        </div>
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
        {articles.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-[#101a2f] p-8 text-slate-300">
            No published articles matched those filters. Try broadening the taxonomy, tag, or author filters.
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[#101a2f] p-6">
            <h2 className="text-2xl font-black">Categories</h2>
            <ul className="mt-6 space-y-4 text-slate-300">
              {taxonomy.categories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/blog/categories/${category.slug}`} className="font-semibold text-white hover:text-blue-300">
                    {category.name}
                  </Link>
                  <p className="mt-1 text-sm text-slate-400">{category.summary}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-[#101a2f] p-6">
            <h2 className="text-2xl font-black">Topic clusters</h2>
            <ul className="mt-6 space-y-4 text-slate-300">
              {taxonomy.clusters.map((cluster) => (
                <li key={cluster.slug}>
                  <Link href={`/blog/clusters/${cluster.slug}`} className="font-semibold text-white hover:text-blue-300">
                    {cluster.name}
                  </Link>
                  <p className="mt-1 text-sm text-slate-400">{cluster.summary}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-[#101a2f] p-6">
            <h2 className="text-2xl font-black">Authors</h2>
            <ul className="mt-6 space-y-4 text-slate-300">
              {taxonomy.authors.map((author) => (
                <li key={author.slug}>
                  <Link href={`/authors/${author.slug}`} className="font-semibold text-white hover:text-blue-300">
                    {author.name}
                  </Link>
                  <p className="mt-1 text-sm text-slate-400">{author.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
