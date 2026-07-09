import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { helpArticles, helpCategories } from "@/data/help-articles";

interface HelpArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return helpArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: HelpArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = helpArticles.find((entry) => entry.slug === slug);

  if (!article) {
    return {
      title: "Help Article",
    };
  }

  return {
    title: `${article.title} | Help Center`,
  };
}

export default async function HelpArticlePage({ params }: HelpArticlePageProps) {
  const { slug } = await params;
  const article = helpArticles.find((entry) => entry.slug === slug);

  if (!article) {
    notFound();
  }

  const category = helpCategories.find((entry) => entry.id === article.category);
  const relatedArticles = article.relatedArticles
    .map((relatedId) => helpArticles.find((entry) => entry.id === relatedId))
    .filter((entry): entry is (typeof helpArticles)[number] => Boolean(entry));

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <li>
              <Link href="/help" className="hover:text-blue-400">
                Help
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              {category ? (
                <Link href={`/help/${category.slug}`} className="hover:text-blue-400">
                  {category.name}
                </Link>
              ) : (
                <span>Category</span>
              )}
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-white">{article.title}</li>
          </ol>
        </nav>

        <article className="mt-8 rounded-xl border border-white/10 bg-[#101a2f] p-8 md:p-10">
          {category ? (
            <div className="inline-flex rounded-full bg-blue-600/20 px-4 py-2 text-sm font-bold text-blue-400">
              {category.name}
            </div>
          ) : null}
          <h1 className="mt-6 text-5xl font-black">{article.title}</h1>
          <p className="mt-4 text-slate-400">Updated {article.updatedAt}</p>
          <div className="mt-8 rounded-xl border border-white/10 bg-slate-900 p-8">
            <p className="text-lg leading-8 text-slate-300">{article.content}</p>
          </div>
        </article>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <aside className="rounded-xl border border-white/10 bg-slate-900 p-8">
          <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
            Feedback
          </p>
          <h2 className="mt-4 text-3xl font-black">Was this helpful?</h2>
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
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <section aria-labelledby="related-articles" className="rounded-xl border border-white/10 bg-[#101a2f] p-8 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
            More to Explore
          </p>
          <h2 id="related-articles" className="mt-4 text-4xl font-black">
            Related Articles
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {relatedArticles.map((relatedArticle) => (
              <Link
                key={relatedArticle.id}
                href={`/help/article/${relatedArticle.slug}`}
                className="rounded-xl border border-white/10 bg-slate-900 p-6 transition hover:border-blue-500"
              >
                <article>
                  <h3 className="text-2xl font-black">{relatedArticle.title}</h3>
                  <p className="mt-3 text-slate-300">{relatedArticle.excerpt}</p>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
