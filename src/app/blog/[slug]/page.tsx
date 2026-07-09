import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/content/ArticleCard";
import { BreadcrumbTrail } from "@/components/content/BreadcrumbTrail";
import { TableOfContents } from "@/components/content/TableOfContents";
import {
  buildArticleMetadata,
  buildArticleStructuredData,
  buildBreadcrumbs,
  buildTableOfContents,
  getSeoScore,
} from "@/lib/content/seo";
import {
  getArticleReadingTime,
  getAuthorBySlug,
  getPublishedArticleBySlug,
  getPublishedArticles,
  getRelatedArticles,
} from "@/lib/content/repository";

export function generateStaticParams() {
  return getPublishedArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getPublishedArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return buildArticleMetadata(article);
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getPublishedArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const author = getAuthorBySlug(article.authorSlug);

  if (!author) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article);
  const tableOfContents = buildTableOfContents(article);
  const structuredData = buildArticleStructuredData(article, author, relatedArticles);

  return (
    <main className="bg-[#08101f] text-white">
      {structuredData.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <BreadcrumbTrail items={buildBreadcrumbs(article)} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-blue-300">AI-discoverable financial education article</p>
              <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">{article.title}</h1>
              <p className="mt-6 max-w-3xl text-lg text-slate-300">{article.excerpt}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <span>By <Link href={`/authors/${author.slug}`} className="font-semibold text-white hover:text-blue-300">{author.name}</Link></span>
                <span aria-hidden="true">•</span>
                <span>{getArticleReadingTime(article)} min read</span>
                <span aria-hidden="true">•</span>
                <span>SEO score {getSeoScore(article)}</span>
                <span aria-hidden="true">•</span>
                <span>{new Date(article.publishedAt ?? article.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {article.entityHighlights.map((entity) => (
                  <span key={entity} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200">
                    {entity}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <TableOfContents items={tableOfContents} />
              <div className="rounded-3xl border border-white/10 bg-[#101a2f] p-6">
                <h2 className="text-xl font-black">AI discoverability checklist</h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                  <li>Entity-first headings and summaries</li>
                  <li>Semantic hierarchy with machine-readable metadata</li>
                  <li>Editorial FAQ section for answer engines</li>
                  <li>Topic cluster mapping for related article graphs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-[#101a2f] p-6">
              <h2 className="text-2xl font-black">Executive summary</h2>
              <p className="mt-4 text-slate-300">{article.summary}</p>
            </div>
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} className="rounded-3xl border border-white/10 bg-[#101a2f] p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-blue-300">Entity focus: {section.entityFocus.join(", ")}</p>
                <h2 className="mt-3 text-3xl font-black">{section.heading}</h2>
                <p className="mt-3 text-lg text-slate-300">{section.summary}</p>
                <div className="mt-5 space-y-4 text-slate-200">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </article>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-[#101a2f] p-6">
              <h2 className="text-xl font-black">Author</h2>
              <p className="mt-3 text-lg font-semibold text-white">{author.name}</p>
              <p className="text-sm text-blue-300">{author.title}</p>
              <p className="mt-4 text-sm text-slate-300">{author.bio}</p>
              <Link href={`/authors/${author.slug}`} className="mt-5 inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
                View author page
              </Link>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#101a2f] p-6">
              <h2 className="text-xl font-black">Publication history</h2>
              <ol className="mt-4 space-y-4 border-l border-white/10 pl-4 text-sm text-slate-300">
                {article.publicationHistory.map((entry) => (
                  <li key={`${entry.state}-${entry.changedAt}`}>
                    <p className="font-semibold text-white">{entry.state}</p>
                    <p>{new Date(entry.changedAt).toLocaleString()}</p>
                    <p className="text-slate-400">{entry.changedBy} — {entry.note}</p>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-[2rem] border border-white/10 bg-[#101a2f] p-6 md:p-8">
          <h2 className="text-3xl font-black">Frequently asked questions</h2>
          <div className="mt-8 space-y-4">
            {article.faq.map((item) => (
              <details key={item.question} className="rounded-2xl border border-white/10 bg-[#0b1220] p-5">
                <summary className="cursor-pointer text-lg font-semibold text-white">{item.question}</summary>
                <p className="mt-3 text-slate-300">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl font-black">Related content</h2>
          <Link href="/blog" className="text-sm text-blue-300 hover:text-white">
            Back to content library
          </Link>
        </div>
        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          {relatedArticles.map((relatedArticle) => (
            <ArticleCard key={relatedArticle.slug} article={relatedArticle} />
          ))}
        </div>
      </section>
    </main>
  );
}
