import Link from "next/link";

import { ArticleCard } from "@/components/content/ArticleCard";
import { EditorialWorkspace } from "@/components/content/EditorialWorkspace";
import { WorkflowBadge } from "@/components/content/WorkflowBadge";
import {
  getArticleSuggestions,
  getEditorialDashboardSnapshot,
} from "@/lib/content/repository";

export default function EditorialDashboardPage() {
  const dashboard = getEditorialDashboardSnapshot();
  const workspaceArticles = dashboard.articles.map((article) => ({
    ...article,
    suggestions: getArticleSuggestions(article),
  }));

  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-300">Admin / editorial operations</p>
            <h1 className="mt-4 text-4xl font-black sm:text-5xl">Enterprise content publishing command center</h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-300">
              Review drafts, approve content, monitor SEO quality, schedule publication, and preserve human control over every AI-assisted change.
            </p>
          </div>
          <Link href="/blog" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 hover:text-white">
            View public content library
          </Link>
        </div>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {[
            { label: "Draft", value: dashboard.counts.draft ?? 0 },
            { label: "In Review", value: dashboard.counts.inReview ?? 0 },
            { label: "Approved", value: dashboard.counts.approved ?? 0 },
            { label: "Scheduled", value: dashboard.counts.scheduled ?? 0 },
            { label: "Published", value: dashboard.counts.published ?? 0 },
            { label: "Archived", value: dashboard.counts.archived ?? 0 },
          ].map((card) => (
            <div key={card.label} className="rounded-3xl border border-white/10 bg-[#101a2f] p-6">
              <p className="text-sm text-slate-400">{card.label}</p>
              <p className="mt-3 text-4xl font-black">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1fr_1fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[#101a2f] p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black">Approval queue</h2>
              <span className="text-sm text-slate-400">Human gate required</span>
            </div>
            <div className="mt-6 space-y-4">
              {dashboard.approvalQueue.map((article) => (
                <article key={article.slug} className="rounded-2xl border border-white/10 bg-[#0b1220] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{article.title}</p>
                      <p className="text-sm text-slate-400">{article.authorSlug} • {article.categorySlug}</p>
                    </div>
                    <WorkflowBadge state={article.status} />
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-[#101a2f] p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black">Scheduling queue</h2>
              <span className="text-sm text-slate-400">Upcoming releases</span>
            </div>
            <div className="mt-6 space-y-4">
              {dashboard.scheduledQueue.map((article) => (
                <article key={article.slug} className="rounded-2xl border border-white/10 bg-[#0b1220] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{article.title}</p>
                      <p className="text-sm text-slate-400">{article.scheduledFor ? new Date(article.scheduledFor).toLocaleString() : "No schedule"}</p>
                    </div>
                    <WorkflowBadge state={article.status} />
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-[#101a2f] p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black">SEO alerts</h2>
              <span className="text-sm text-slate-400">Resolve before publish</span>
            </div>
            <div className="mt-6 space-y-4">
              {dashboard.seoAlerts.map(({ article, seoScore }) => (
                <article key={article.slug} className="rounded-2xl border border-white/10 bg-[#0b1220] p-4">
                  <p className="font-semibold text-white">{article.title}</p>
                  <p className="mt-2 text-sm text-slate-400">SEO score {seoScore}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <EditorialWorkspace articles={workspaceArticles} />
        </section>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-[#101a2f] p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black">Content performance and featured management</h2>
            <span className="text-sm text-slate-400">Featured and trending are visible in the public library</span>
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            {dashboard.articles
              .filter((article) => article.status === "published")
              .slice(0, 3)
              .map((article) => (
                <ArticleCard key={article.slug} article={article} showStatus />
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}
