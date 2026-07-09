import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { kbArticles, kbCategories } from "@/data/knowledge-base";

interface KnowledgeBaseCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export function generateStaticParams() {
  return kbCategories.map((category) => ({
    category: category.slug,
  }));
}

function getCategoryBySlug(categorySlug: string) {
  return kbCategories.find((category) => category.slug === categorySlug);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export async function generateMetadata({
  params,
}: KnowledgeBaseCategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "Knowledge Base Category",
    };
  }

  return {
    title: `${category.name} | Knowledge Base`,
  };
}

export default async function KnowledgeBaseCategoryPage({
  params,
}: KnowledgeBaseCategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const categoryArticles = kbArticles.filter((article) => article.category === category.id);
  const relatedCategories = kbCategories.filter((entry) => entry.id !== category.id);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <li>
              <Link href="/knowledge-base" className="hover:text-blue-400">
                Knowledge Base
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-white">{category.name}</li>
          </ol>
        </nav>

        <div className="mt-8 max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
            {category.name}
          </p>
          <h1 className="mt-6 text-5xl font-black md:text-6xl">{category.name}</h1>
          <p className="mt-6 text-lg text-slate-300">{category.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <section aria-labelledby="category-articles">
            <h2 id="category-articles" className="text-4xl font-black">
              Articles in this category
            </h2>
            <div className="mt-8 space-y-4">
              {categoryArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/knowledge-base/${category.slug}/${article.slug}`}
                  className="block rounded-xl border border-white/10 bg-slate-900 p-8 transition hover:border-blue-500"
                >
                  <article>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
                        Updated {formatDate(article.updatedAt)}
                      </p>
                      <span className="rounded-full border border-blue-500/30 bg-blue-600/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
                        v{article.version}
                      </span>
                    </div>
                    <h3 className="mt-3 text-2xl font-black">{article.title}</h3>
                    <p className="mt-3 text-slate-300">{article.excerpt}</p>
                  </article>
                </Link>
              ))}
            </div>
          </section>

          <aside className="rounded-xl border border-white/10 bg-[#101a2f] p-8">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
              Related Categories
            </p>
            <div className="mt-6 space-y-4">
              {relatedCategories.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/knowledge-base/${entry.slug}`}
                  className="block rounded-xl border border-white/10 bg-slate-900 p-5 transition hover:border-blue-500"
                >
                  <p className="text-lg font-black">{entry.name}</p>
                  <p className="mt-2 text-sm text-slate-300">{entry.description}</p>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
