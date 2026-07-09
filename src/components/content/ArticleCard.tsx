import Link from "next/link";

import { WorkflowBadge } from "@/components/content/WorkflowBadge";
import { getArticleReadingTime } from "@/lib/content/repository";
import type { ContentArticle } from "@/lib/content/types";

interface ArticleCardProps {
  article: ContentArticle;
  href?: string;
  showStatus?: boolean;
}

export function ArticleCard({ article, href = `/blog/${article.slug}`, showStatus = false }: ArticleCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-[#101a2f] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.24)]">
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
        <span>{article.categorySlug.replace(/-/g, " ")}</span>
        <span aria-hidden="true">•</span>
        <span>{getArticleReadingTime(article)} min read</span>
        {showStatus ? <WorkflowBadge state={article.status} /> : null}
      </div>
      <h2 className="mt-4 text-2xl font-black leading-tight text-white">
        <Link href={href} className="hover:text-blue-300">
          {article.title}
        </Link>
      </h2>
      <p className="mt-4 text-base text-slate-300">{article.excerpt}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {article.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200">
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-sm text-slate-400">Audience: {article.audience.join(", ")}</span>
        <Link href={href} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
          View article
        </Link>
      </div>
    </article>
  );
}
