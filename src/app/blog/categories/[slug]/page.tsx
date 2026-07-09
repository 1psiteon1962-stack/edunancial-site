import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/content/ArticleCard";
import { BreadcrumbTrail } from "@/components/content/BreadcrumbTrail";
import {
  getCategoryBySlug,
  getPublishedArticles,
  getPublishedArticlesByCategory,
} from "@/lib/content/repository";
import { createSEO } from "@/lib/seo";

export function generateStaticParams() {
  const categories = new Set<string>();
  getPublishedArticles().forEach((article) => {
    categories.add(article.categorySlug);
    article.secondaryCategorySlugs.forEach((slug) => categories.add(slug));
  });

  return Array.from(categories).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {};
  }

  return createSEO(
    `${category.name} Articles`,
    category.summary,
    `/blog/categories/${category.slug}`
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const articles = getPublishedArticlesByCategory(slug);

  return (
    <main className="bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <BreadcrumbTrail
          items={[
            { name: "Blog", href: "/blog" },
            { name: category.name, href: `/blog/categories/${category.slug}` },
          ]}
        />
        <div className="mt-8 rounded-[2rem] border border-white/10 bg-[#101a2f] p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-300">Category archive</p>
          <h1 className="mt-4 text-4xl font-black">{category.name}</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">{category.summary}</p>
          <p className="mt-6 text-sm text-slate-400">
            Cluster: <Link href={`/blog/clusters/${category.clusterSlug}`} className="text-blue-300 hover:text-white">{category.clusterSlug.replace(/-/g, " ")}</Link>
          </p>
        </div>
        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </main>
  );
}
