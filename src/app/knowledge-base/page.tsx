import Link from "next/link";
import type { Metadata } from "next";
import { kbArticles, kbCategories } from "@/data/knowledge-base";

export const metadata: Metadata = {
  title: "Knowledge Base",
};

const featuredArticles = kbArticles.slice(0, 6);
const recentlyUpdatedArticles = [...kbArticles]
  .sort((first, second) => {
    return new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime();
  })
  .slice(0, 5);

function getCategoryById(categoryId: string) {
  return kbCategories.find((category) => category.id === categoryId);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export default function KnowledgeBasePage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
            KNOWLEDGE BASE
          </p>
          <h1 className="mt-6 text-5xl font-black md:text-6xl">Knowledge Base</h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Explore detailed guides, product references, and policy explanations across the
            Edunancial platform.
          </p>
          <div className="mt-10 rounded-xl border border-white/10 bg-[#101a2f] p-6">
            <label htmlFor="knowledge-base-search" className="mb-3 block text-sm font-bold text-slate-300">
              Search the knowledge base
            </label>
            <input
              id="knowledge-base-search"
              type="search"
              placeholder="Search the knowledge base..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16" aria-labelledby="kb-categories">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
              Browse by Topic
            </p>
            <h2 id="kb-categories" className="mt-4 text-4xl font-black">
              Categories
            </h2>
          </div>
          <p className="text-slate-400">{kbCategories.length} knowledge base categories</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {kbCategories.map((category) => (
            <Link
              key={category.id}
              href={`/knowledge-base/${category.slug}`}
              className="rounded-xl border border-white/10 bg-slate-900 p-8 transition hover:border-blue-500"
            >
              <article className="h-full">
                <div className="text-4xl" aria-hidden="true">
                  {category.icon}
                </div>
                <h3 className="mt-6 text-2xl font-black">{category.name}</h3>
                <p className="mt-4 text-slate-300">{category.description}</p>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16" aria-labelledby="featured-articles">
        <div className="rounded-xl border border-white/10 bg-[#101a2f] p-8 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
            Editor&apos;s Picks
          </p>
          <h2 id="featured-articles" className="mt-4 text-4xl font-black">
            Featured Articles
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredArticles.map((article) => {
              const category = getCategoryById(article.category);

              if (!category) {
                return null;
              }

              return (
                <Link
                  key={article.id}
                  href={`/knowledge-base/${category.slug}/${article.slug}`}
                  className="rounded-xl border border-white/10 bg-slate-900 p-6 transition hover:border-blue-500"
                >
                  <article className="h-full">
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
                      {category.name}
                    </p>
                    <h3 className="mt-3 text-2xl font-black">{article.title}</h3>
                    <p className="mt-3 text-slate-300">{article.excerpt}</p>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24" aria-labelledby="recently-updated">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <section className="rounded-xl border border-white/10 bg-slate-900 p-8 md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
              Fresh Updates
            </p>
            <h2 id="recently-updated" className="mt-4 text-4xl font-black">
              Recently Updated
            </h2>
            <div className="mt-8 space-y-4">
              {recentlyUpdatedArticles.map((article) => {
                const category = getCategoryById(article.category);

                if (!category) {
                  return null;
                }

                return (
                  <Link
                    key={article.id}
                    href={`/knowledge-base/${category.slug}/${article.slug}`}
                    className="block rounded-xl border border-white/10 bg-[#101a2f] p-6 transition hover:border-blue-500"
                  >
                    <article className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
                          {category.name}
                        </p>
                        <h3 className="mt-2 text-2xl font-black">{article.title}</h3>
                      </div>
                      <p className="text-sm text-slate-400">Updated {formatDate(article.updatedAt)}</p>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>

          <aside className="rounded-xl border border-white/10 bg-[#101a2f] p-8">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
              Need More Help?
            </p>
            <h2 className="mt-4 text-3xl font-black">Can&apos;t find the answer?</h2>
            <p className="mt-4 text-slate-300">
              Browse by category or contact our support team for billing, technical, or account
              questions.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-lg bg-blue-600 px-5 py-3 font-bold hover:bg-blue-500"
              >
                Contact Support
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
