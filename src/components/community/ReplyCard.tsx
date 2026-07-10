import type { DiscussionPost } from "@/types/community";
import { BADGE_LABELS, BADGE_COLORS } from "@/data/community";

interface ReplyCardProps {
  reply: DiscussionPost;
  isFirst?: boolean;
}

export default function ReplyCard({ reply, isFirst }: ReplyCardProps) {
  const badge = reply.author.badge;

  return (
    <article
      id={`reply-${reply.id}`}
      className={`rounded-xl bg-slate-800 p-6 ${isFirst ? "border border-yellow-400/20" : ""}`}
    >
      {reply.quotedContent && (
        <blockquote className="mb-4 rounded-lg border-l-4 border-blue-500 bg-slate-700/50 px-4 py-3 text-sm text-slate-300 italic">
          {reply.quotedContent}
        </blockquote>
      )}

      <div className="flex items-start gap-4">
        <div
          className={`h-10 w-10 rounded-full ${reply.author.avatarColor} flex items-center justify-center text-sm font-bold text-white shrink-0`}
          aria-hidden="true"
        >
          {reply.author.avatarInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-semibold text-white">
              {reply.author.displayName}
            </span>
            <span
              className={`inline-block rounded-full border px-2 py-0.5 text-xs ${BADGE_COLORS[badge]}`}
            >
              {BADGE_LABELS[badge]}
            </span>
            {reply.isHelpful && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-400/10 px-2 py-0.5 text-xs font-semibold text-green-400 border border-green-400/30">
                ✅ Helpful Answer
              </span>
            )}
            <time
              className="ml-auto text-xs text-slate-500"
              dateTime={reply.createdAt}
            >
              {new Date(reply.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>

          <p className="text-slate-300 leading-relaxed">{reply.content}</p>

          <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
            <button
              type="button"
              className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
              aria-label={`Like this reply — ${reply.likes} likes`}
            >
              <span aria-hidden="true">👍</span>
              <span>{reply.likes}</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1 hover:text-blue-400 transition-colors"
              aria-label="Quote this reply"
            >
              <span aria-hidden="true">💬</span>
              <span>Quote</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1 hover:text-red-400 transition-colors"
              aria-label="Report this reply"
            >
              <span aria-hidden="true">🚩</span>
              <span>Report</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
