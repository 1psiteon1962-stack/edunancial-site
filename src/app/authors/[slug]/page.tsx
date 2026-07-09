import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/content/ArticleCard";
import { BreadcrumbTrail } from "@/components/content/BreadcrumbTrail";
import {
  getAuthorBySlug,
  getLibraryTaxonomy,
  getPublishedArticlesByAuthor,
} from "@/lib/content/repository";
import { createSEO } from "@/lib/seo";

export function generateStaticParams() {
  return getLibraryTaxonomy().authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    return {};
  }

  return createSEO(author.name, author.bio, `/authors/${author.slug}`);
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const articles = getPublishedArticlesByAuthor(slug);

  return (
    <main className="bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <BreadcrumbTrail
          items={[
            { name: "Blog", href: "/blog" },
            { name: author.name, href: `/authors/${author.slug}` },
          ]}
        />
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[#101a2f] p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-blue-300">Author page</p>
            <h1 className="mt-4 text-4xl font-black">{author.name}</h1>
            <p className="mt-2 text-lg text-blue-300">{author.title}</p>
            <p className="mt-6 text-slate-300">{author.bio}</p>
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-white">Expertise</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {author.expertise.map((item) => (
                  <span key={item} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-white">Credentials</h2>
              <ul className="mt-3 space-y-2 text-slate-300">
                {author.credentials.map((credential) => (
                  <li key={credential}>{credential}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-[#101a2f] p-8">
            <h2 className="text-3xl font-black">Published articles</h2>
            <p className="mt-3 text-slate-300">
              {author.name} contributes educational content designed for discoverability, clarity, and editorial accountability.
            </p>
            <div className="mt-8 grid gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
