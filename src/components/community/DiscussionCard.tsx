import Link from "next/link";
import type { Discussion } from "@/types/community";
import { CATEGORY_LABELS, BADGE_LABELS, BADGE_COLORS } from "@/data/community";

interface DiscussionCardProps {
  discussion: Discussion;
  showCategory?: boolean;
}

export default function DiscussionCard({
  discussion,
  showCategory = true,
}: DiscussionCardProps) {
  const badge = discussion.author.badge;

  return (
    <article className="rounded-xl bg-slate-800 p-6 hover:bg-slate-700 transition-colors">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-3">
            {discussion.isPinned && (
              <span className="inline-flex items-center rounded-full bg-yellow-400/10 px-2 py-0.5 text-xs font-semibold text-yellow-400 border border-yellow-400/30">
                📌 Pinned
              </span>
            )}
            {discussion.isStaffPick && (
              <span className="inline-flex items-center rounded-full bg-blue-400/10 px-2 py-0.5 text-xs font-semibold text-blue-400 border border-blue-400/30">
                ⭐ Staff Pick
              </span>
            )}
            {discussion.isFeatured && (
              <span className="inline-flex items-center rounded-full bg-purple-400/10 px-2 py-0.5 text-xs font-semibold text-purple-400 border border-purple-400/30">
                🔥 Featured
              </span>
            )}
            {showCategory && (
              <span className="inline-flex items-center rounded-full bg-slate-600 px-2 py-0.5 text-xs font-semibold text-slate-300">
                {CATEGORY_LABELS[discussion.category] ?? discussion.category}
              </span>
            )}
          </div>

          <Link
            href={`/community/discussion/${discussion.id}`}
            className="block group"
          >
            <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-2">
              {discussion.title}
            </h3>
          </Link>

          <p className="mt-2 text-sm text-slate-400 line-clamp-2">
            {discussion.content}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {discussion.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="inline-block rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300"
              >
                #{tag.label}
              </span>
            ))}
          </div>
        </div>

        <div className="text-right shrink-0 text-sm text-slate-400 space-y-1">
          <div className="flex items-center gap-1 justify-end">
            <span aria-hidden="true">👍</span>
            <span>{discussion.likes}</span>
          </div>
          <div className="flex items-center gap-1 justify-end">
            <span aria-hidden="true">💬</span>
            <span>{discussion.replyCount}</span>
          </div>
          <div className="flex items-center gap-1 justify-end">
            <span aria-hidden="true">👁️</span>
            <span>{discussion.views.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 pt-4 border-t border-slate-700">
        <div
          className={`h-8 w-8 rounded-full ${discussion.author.avatarColor} flex items-center justify-center text-xs font-bold text-white`}
          aria-hidden="true"
        >
          {discussion.author.avatarInitials}
        </div>
        <div>
          <span className="text-sm font-semibold text-slate-200">
            {discussion.author.displayName}
          </span>
          <span
            className={`ml-2 inline-block rounded-full border px-2 py-0.5 text-xs ${BADGE_COLORS[badge]}`}
          >
            {BADGE_LABELS[badge]}
          </span>
        </div>
        <time
          className="ml-auto text-xs text-slate-500"
          dateTime={discussion.createdAt}
        >
          {new Date(discussion.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </time>
      </div>
    </article>
  );
}
