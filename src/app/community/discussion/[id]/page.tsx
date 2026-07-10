import { notFound } from "next/navigation";
import Link from "next/link";
import ReplyCard from "@/components/community/ReplyCard";
import {
  getDiscussionById,
  DISCUSSIONS,
  BADGE_LABELS,
  BADGE_COLORS,
  CATEGORY_LABELS,
} from "@/data/community";

interface DiscussionPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return DISCUSSIONS.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: DiscussionPageProps) {
  const { id } = await params;
  const discussion = getDiscussionById(id);
  if (!discussion) return { title: "Discussion | Edunancial Community" };
  return {
    title: `${discussion.title} | Edunancial Community`,
    description: discussion.content.slice(0, 160),
  };
}

export default async function DiscussionPage({ params }: DiscussionPageProps) {
  const { id } = await params;
  const discussion = getDiscussionById(id);

  if (!discussion) {
    notFound();
  }

  const badge = discussion.author.badge;
  const categoryLabel =
    CATEGORY_LABELS[discussion.category] ?? discussion.category;

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <article className="mx-auto max-w-4xl px-6 py-24">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-400">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/community" className="hover:text-yellow-400 transition-colors">
                Community
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link href="/community/forum" className="hover:text-yellow-400 transition-colors">
                Forums
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link
                href={`/community/forum/${discussion.category}`}
                className="hover:text-yellow-400 transition-colors"
              >
                {categoryLabel}
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li className="text-slate-200 truncate max-w-xs" aria-current="page">
              {discussion.title}
            </li>
          </ol>
        </nav>

        {/* Badges row */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Link
            href={`/community/forum/${discussion.category}`}
            className="inline-block rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-300 hover:text-yellow-400 transition-colors"
          >
            {categoryLabel}
          </Link>
          {discussion.isPinned && (
            <span className="inline-flex items-center rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-400 border border-yellow-400/30">
              📌 Pinned
            </span>
          )}
          {discussion.isStaffPick && (
            <span className="inline-flex items-center rounded-full bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-400/30">
              ⭐ Staff Pick
            </span>
          )}
          {discussion.isFeatured && (
            <span className="inline-flex items-center rounded-full bg-purple-400/10 px-3 py-1 text-xs font-semibold text-purple-400 border border-purple-400/30">
              🔥 Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black md:text-4xl leading-tight">
          {discussion.title}
        </h1>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400 pb-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full ${discussion.author.avatarColor} flex items-center justify-center text-xs font-bold text-white`}
              aria-hidden="true"
            >
              {discussion.author.avatarInitials}
            </div>
            <span className="font-semibold text-slate-200">
              {discussion.author.displayName}
            </span>
            <span
              className={`inline-block rounded-full border px-2 py-0.5 text-xs ${BADGE_COLORS[badge]}`}
            >
              {BADGE_LABELS[badge]}
            </span>
          </div>
          <span>·</span>
          <time dateTime={discussion.createdAt}>
            {new Date(discussion.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
          <span>·</span>
          <span>{discussion.views.toLocaleString()} views</span>
          <span>·</span>
          <span>{discussion.replyCount} replies</span>
        </div>

        {/* Body */}
        <div className="mt-8 prose prose-invert prose-lg max-w-none">
          <p className="text-slate-200 leading-relaxed text-lg whitespace-pre-wrap">
            {discussion.content}
          </p>
        </div>

        {/* Tags */}
        {discussion.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {discussion.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/community/search?q=${encodeURIComponent(tag.label)}`}
                className="inline-block rounded-full bg-slate-700 px-3 py-1 text-sm text-slate-300 hover:text-yellow-400 hover:bg-slate-600 transition-colors"
              >
                #{tag.label}
              </Link>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-4 py-4 border-t border-b border-slate-700">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700 transition-colors"
            aria-label={`Like this discussion — ${discussion.likes} likes`}
          >
            <span aria-hidden="true">👍</span>
            <span>{discussion.likes} Likes</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700 transition-colors"
            aria-label="Bookmark this discussion"
          >
            <span aria-hidden="true">🔖</span>
            <span>Bookmark</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700 transition-colors"
            aria-label="Share this discussion"
          >
            <span aria-hidden="true">🔗</span>
            <span>Share</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-red-900/30 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-900/50 transition-colors ml-auto"
            aria-label="Report this discussion"
          >
            <span aria-hidden="true">🚩</span>
            <span>Report</span>
          </button>
        </div>

        {/* Replies */}
        {discussion.replies.length > 0 && (
          <section aria-labelledby="replies-heading" className="mt-12">
            <h2 id="replies-heading" className="text-2xl font-black mb-6">
              Replies ({discussion.replyCount})
            </h2>
            <div className="space-y-4">
              {discussion.replies.map((reply, i) => (
                <ReplyCard key={reply.id} reply={reply} isFirst={i === 0} />
              ))}
            </div>
          </section>
        )}

        {/* Reply form */}
        <section aria-labelledby="reply-form-heading" className="mt-12">
          <h2 id="reply-form-heading" className="text-2xl font-black mb-6">
            Post a Reply
          </h2>
          <div className="rounded-xl bg-slate-800 p-6">
            <label
              htmlFor="reply-content"
              className="block text-sm font-semibold text-slate-300 mb-3"
            >
              Your reply
            </label>
            <textarea
              id="reply-content"
              name="reply-content"
              rows={6}
              className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-yellow-400 transition-colors resize-y"
              placeholder="Share your knowledge, experience, or question..."
              aria-describedby="reply-hint"
            />
            <p id="reply-hint" className="mt-2 text-xs text-slate-500">
              Be respectful, accurate, and helpful. See our community guidelines.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 justify-between items-center">
              <div className="flex flex-wrap gap-2 text-sm text-slate-400">
                <button type="button" className="rounded px-2 py-1 bg-slate-700 hover:bg-slate-600 transition-colors font-bold" aria-label="Bold text">B</button>
                <button type="button" className="rounded px-2 py-1 bg-slate-700 hover:bg-slate-600 transition-colors italic" aria-label="Italic text">I</button>
                <button type="button" className="rounded px-2 py-1 bg-slate-700 hover:bg-slate-600 transition-colors" aria-label="Add link">🔗</button>
                <button type="button" className="rounded px-2 py-1 bg-slate-700 hover:bg-slate-600 transition-colors" aria-label="Quote reply">💬</button>
              </div>
              <Link
                href="/login"
                className="rounded-xl bg-yellow-400 px-6 py-3 font-bold text-black hover:bg-yellow-300 transition-colors"
              >
                Sign in to Reply
              </Link>
            </div>
          </div>
        </section>

        {/* Back link */}
        <div className="mt-12">
          <Link
            href={`/community/forum/${discussion.category}`}
            className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
          >
            ← Back to {CATEGORY_LABELS[discussion.category] ?? "Forum"}
          </Link>
        </div>

      </article>
    </main>
  );
}
