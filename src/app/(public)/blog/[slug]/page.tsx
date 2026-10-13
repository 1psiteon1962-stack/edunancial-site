import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { blogHreflang } from "@/lib/blog/locale";
import { getPublishedArticle, listPublishedTranslations } from "@/lib/blog/reader";
import { renderBlogMarkdown } from "@/lib/blog/safe-markdown";

const SITE_URL = "https://edunancial.com";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) return {};
  const siblings = await listPublishedTranslations(article.translation_group_id);
  const languages = Object.fromEntries(
    siblings.map((sibling) => [
      blogHreflang(sibling.locale),
      sibling.locale === "en-US"
        ? `${SITE_URL}/blog/${sibling.slug}`
        : `${SITE_URL}/blog/${sibling.locale.toLowerCase()}/${sibling.slug}`,
    ]),
  );
  const canonical = `${SITE_URL}/blog/${article.slug}`;
  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.summary,
    alternates: { canonical, languages: { ...languages, "x-default": canonical } },
    openGraph: { type: "article", url: canonical, title: article.title, description: article.summary },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();
  const canonical = `${SITE_URL}/blog/${article.slug}`;
  const schema = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    headline: article.title, description: article.summary, author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: "Edunancial", url: SITE_URL },
    datePublished: article.published_at || undefined, inLanguage: blogHreflang(article.locale), mainEntityOfPage: canonical,
  };
  return <main className="min-h-screen bg-[#08101f] text-white">
    <article className="mx-auto max-w-3xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <p className="text-sm font-black uppercase tracking-widest text-yellow-400">{article.track ?? "Edunancial"}</p>
      <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">{article.title}</h1>
      <p className="mt-6 text-xl leading-8 text-slate-300">{article.summary}</p>
      <p className="mt-4 text-sm text-slate-400">By {article.author}</p>
      <div className="prose prose-invert mt-10 max-w-none leading-8" dangerouslySetInnerHTML={{ __html: renderBlogMarkdown(article.body) }} />
      <aside className="mt-12 border-t border-white/10 pt-6 text-sm leading-6 text-slate-400">
        Educational information only. Consider qualified professional advice for decisions requiring legal, tax, investment, or other regulated expertise.
      </aside>
    </article>
  </main>;
}
