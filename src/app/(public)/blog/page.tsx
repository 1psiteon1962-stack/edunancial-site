import Link from "next/link";
import type { Metadata } from "next";

import { listPublishedArticles } from "@/lib/blog/reader";

export const metadata: Metadata = {
  title: "Blog | Edunancial",
  description: "Practical financial education articles on real estate, business, investing, and economic self-defense.",
  alternates: { canonical: "https://edunancial.com/blog" },
};

export default async function BlogPage() {
  const articles = await listPublishedArticles("en-US");
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-xs font-black uppercase tracking-[0.45em] text-yellow-400">Edunancial</p>
        <h1 className="mt-5 text-5xl font-black sm:text-6xl">Blog</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Financial education and practical analysis designed to build financial competency.
        </p>
        {articles.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-8 text-slate-300">
            Articles are being prepared. Check back soon.
          </div>
        ) : (
          <div className="mt-12 grid gap-6">
            {articles.map((article) => (
              <article key={article.id} className="rounded-2xl border border-white/10 bg-white/5 p-7">
                <p className="text-xs font-black uppercase tracking-widest text-yellow-400">{article.track ?? "Edunancial"}</p>
                <h2 className="mt-3 text-2xl font-black"><Link href={`/blog/${article.slug}`} className="hover:text-yellow-300">{article.title}</Link></h2>
                <p className="mt-3 leading-7 text-slate-300">{article.summary}</p>
                <Link href={`/blog/${article.slug}`} className="mt-5 inline-block font-bold text-yellow-400">Read article →</Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
