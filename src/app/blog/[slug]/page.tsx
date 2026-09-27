import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedArticle } from '@/lib/blog/reader';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) return {};
  return { title: article.title, description: article.summary, alternates: { canonical: `/blog/${article.slug}` } };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();
  return <main className="mx-auto max-w-3xl px-6 py-12">
    <article>
      <p className="text-sm uppercase">{article.track ?? 'Edunancial'}</p>
      <h1 className="mt-2 text-4xl font-bold">{article.title}</h1>
      <p className="mt-4 text-lg">{article.summary}</p>
      <p className="mt-3 text-sm">By {article.author}</p>
      <div className="mt-8 whitespace-pre-wrap leading-7">{article.body}</div>
    </article>
    <aside className="mt-10 border-t pt-6 text-sm">Educational information only. Consider qualified professional advice for decisions requiring legal, tax, investment, or other regulated expertise.</aside>
  </main>;
}
