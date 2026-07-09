import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/content/ArticleCard";
import { BreadcrumbTrail } from "@/components/content/BreadcrumbTrail";
import {
  getClusterBySlug,
  getLibraryTaxonomy,
  getPublishedArticlesByCluster,
} from "@/lib/content/repository";
import { createSEO } from "@/lib/seo";

export function generateStaticParams() {
  return getLibraryTaxonomy().clusters.map((cluster) => ({ slug: cluster.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cluster = getClusterBySlug(slug);

  if (!cluster) {
    return {};
  }

  return createSEO(cluster.name, cluster.summary, `/blog/clusters/${cluster.slug}`);
}

export default async function ClusterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cluster = getClusterBySlug(slug);

  if (!cluster) {
    notFound();
  }

  const articles = getPublishedArticlesByCluster(slug);

  return (
    <main className="bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <BreadcrumbTrail
          items={[
            { name: "Blog", href: "/blog" },
            { name: cluster.name, href: `/blog/clusters/${cluster.slug}` },
          ]}
        />
        <div className="mt-8 rounded-[2rem] border border-white/10 bg-[#101a2f] p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-300">Topic cluster</p>
          <h1 className="mt-4 text-4xl font-black">{cluster.name}</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">{cluster.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {cluster.entityFocus.map((entity) => (
              <span key={entity} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200">
                {entity}
              </span>
            ))}
          </div>
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
