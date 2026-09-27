import Link from 'next/link';
import { listPublishedArticles } from '@/lib/blog/reader';

export const metadata = {
  title: 'Edunancial Blog | Financial Literacy to Financial Intelligence',
  description: 'Practical education across real estate, business, personal finance, investing, law, sales and leadership.',
};

export default async function BlogPage() {
  const articles = await listPublishedArticles();
  return <main className="mx-auto max-w-6xl px-6 py-12">
    <header className="mb-10">
      <h1 className="text-4xl font-bold">Edunancial Blog</h1>
      <p className="mt-3 max-w-3xl text-lg">Practical ideas designed to help you move from financial literacy to financial intelligence.</p>
    </header>
    {articles.length === 0 ? <p>Our first articles are being prepared.</p> :
      <div className="grid gap-6 md:grid-cols-2">
        {articles.map(a => <article key={a.id} className="rounded-xl border p-6">
          <p className="text-sm uppercase">{a.track ?? 'Edunancial'}</p>
          <h2 className="mt-2 text-2xl font-semibold"><Link href={`/blog/${a.slug}`}>{a.title}</Link></h2>
          <p className="mt-3">{a.summary}</p>
          <Link className="mt-4 inline-block underline" href={`/blog/${a.slug}`}>Read article</Link>
        </article>)}
      </div>}
  </main>;
}
