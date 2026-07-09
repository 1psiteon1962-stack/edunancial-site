import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { kbArticles, kbCategories } from "@/data/knowledge-base";

interface KnowledgeBaseArticlePageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

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

function getPreviousVersion(version: string) {
  const parsedVersion = Number.parseFloat(version);

  if (Number.isNaN(parsedVersion)) {
    return "1.0";
  }

  return Math.max(parsedVersion - 0.1, 0.1).toFixed(1);
}

function getPreviousVersionDate(updatedAt: string) {
  const priorDate = new Date(updatedAt);
  priorDate.setUTCDate(priorDate.getUTCDate() - 18);
  return formatDate(priorDate.toISOString());
}

export function generateStaticParams() {
  return kbArticles
    .map((article) => {
      const category = getCategoryById(article.category);

      if (!category) {
        return null;
      }

      return {
        category: category.slug,
        slug: article.slug,
      };
    })
    .filter(
      (
        entry,
      ): entry is {
        category: string;
        slug: string;
      } => Boolean(entry),
    );
}

export async function generateMetadata({
  params,
}: KnowledgeBaseArticlePageProps): Promise<Metadata> {
  const { category: categorySlug, slug } = await params;
  const article = kbArticles.find((entry) => entry.slug === slug);
  const category = article ? getCategoryById(article.category) : undefined;

  if (!article || !category || category.slug !== categorySlug) {
    return {
      title: "Knowledge Base Article",
    };
  }

  return {
    title: `${article.title} | Knowledge Base`,
  };
}

export default async function KnowledgeBaseArticlePage({
  params,
}: KnowledgeBaseArticlePageProps) {
  const { category: categorySlug, slug } = await params;
  const article = kbArticles.find((entry) => entry.slug === slug);

  if (!article) {
    notFound();
  }

  const category = getCategoryById(article.category);

  if (!category || category.slug !== categorySlug) {
    notFound();
  }

  const relatedArticles = article.relatedArticles
    .map((relatedId) => {
      const relatedArticle = kbArticles.find((entry) => entry.id === relatedId);
      const relatedCategory = relatedArticle ? getCategoryById(relatedArticle.category) : undefined;

      if (!relatedArticle || !relatedCategory) {
        return null;
      }

      return {
        article: relatedArticle,
        category: relatedCategory,
      };
    })
    .filter(
      (
        entry,
      ): entry is {
        article: (typeof kbArticles)[number];
        category: (typeof kbCategories)[number];
      } => Boolean(entry),
    );

  const previousVersion = getPreviousVersion(article.version);
  const previousVersionDate = getPreviousVersionDate(article.updatedAt);
  const paragraphs = article.content.split("\n\n");

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <li>
              <Link href="/knowledge-base" className="hover:text-blue-400">
                Knowledge Base
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/knowledge-base/${category.slug}`} className="hover:text-blue-400">
                {category.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-white">{article.title}</li>
          </ol>
        </nav>

        <article className="mt-8 rounded-xl border border-white/10 bg-[#101a2f] p-8 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
            {category.name}
          </p>
          <h1 className="mt-6 text-5xl font-black">{article.title}</h1>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-300">
            <span className="rounded-full border border-white/10 bg-slate-900 px-4 py-2">
              Author: {article.author}
            </span>
            <span className="rounded-full border border-white/10 bg-slate-900 px-4 py-2">
              Version: v{article.version}
            </span>
            <span className="rounded-full border border-white/10 bg-slate-900 px-4 py-2">
              Last Updated: {formatDate(article.updatedAt)}
            </span>
          </div>

          <div className="mt-8 rounded-xl border border-white/10 bg-slate-900 p-8">
            <div className="space-y-6 text-lg leading-8 text-slate-300">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <section className="rounded-xl border border-white/10 bg-slate-900 p-8" aria-labelledby="version-history">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
              Release Notes
            </p>
            <h2 id="version-history" className="mt-4 text-4xl font-black">
              Version History
            </h2>
            <div className="mt-8 space-y-4">
              <article className="rounded-xl border border-blue-500 bg-blue-600/10 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-2xl font-black text-blue-400">v{article.version}</h3>
                  <p className="text-sm text-slate-300">{formatDate(article.updatedAt)}</p>
                </div>
                <p className="mt-3 text-slate-300">
                  Current version with the latest article language, structure, and support details.
                </p>
              </article>
              <article className="rounded-xl border border-white/10 bg-[#101a2f] p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-2xl font-black">v{previousVersion}</h3>
                  <p className="text-sm text-slate-400">{previousVersionDate}</p>
                </div>
                <p className="mt-3 text-slate-300">
                  Minor clarifications and formatting updates.
                </p>
              </article>
            </div>
          </section>

          <aside className="rounded-xl border border-white/10 bg-[#101a2f] p-8">
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
              Feedback
            </p>
            <h2 className="mt-4 text-3xl font-black">Was this helpful?</h2>
            <p className="mt-4 text-slate-300">
              Let us know if this article answered your question.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                type="button"
                className="rounded-lg bg-blue-600 px-5 py-3 font-bold hover:bg-blue-500"
              >
                Yes
              </button>
              <button
                type="button"
                className="rounded-lg border border-white/10 px-5 py-3 font-bold hover:border-blue-500"
              >
                No
              </button>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <section
          aria-labelledby="related-articles"
          className="rounded-xl border border-white/10 bg-[#101a2f] p-8 md:p-10"
        >
          <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
            Keep Reading
          </p>
          <h2 id="related-articles" className="mt-4 text-4xl font-black">
            Related Articles
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {relatedArticles.map((relatedEntry) => (
              <Link
                key={relatedEntry.article.id}
                href={`/knowledge-base/${relatedEntry.category.slug}/${relatedEntry.article.slug}`}
                className="rounded-xl border border-white/10 bg-slate-900 p-6 transition hover:border-blue-500"
              >
                <article>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
                    {relatedEntry.category.name}
                  </p>
                  <h3 className="mt-3 text-2xl font-black">{relatedEntry.article.title}</h3>
                  <p className="mt-3 text-slate-300">{relatedEntry.article.excerpt}</p>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
