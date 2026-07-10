import Link from "next/link";
import { FORUM_CATEGORIES } from "@/data/community";

export const metadata = {
  title: "Start a Discussion | Edunancial Community",
  description:
    "Start a new discussion in the Edunancial community. Ask questions, share experiences, and help others on their financial literacy journey.",
};

export default function NewDiscussionPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-4xl px-6 py-24">

        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-400">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/community" className="hover:text-yellow-400 transition-colors">
                Community
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li className="text-slate-200" aria-current="page">New Discussion</li>
          </ol>
        </nav>

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400 text-sm">
          COMMUNITY
        </p>
        <h1 className="mt-4 text-4xl font-black md:text-5xl">
          Start a Discussion
        </h1>
        <p className="mt-4 text-xl text-slate-300">
          Share your knowledge, ask a question, or spark a conversation that
          helps our community grow financially stronger.
        </p>

        {/* Guidelines summary */}
        <div className="mt-10 rounded-xl border border-blue-500/30 bg-blue-900/20 p-6">
          <h2 className="font-bold text-blue-300 mb-2">Community Guidelines</h2>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>✅ Share verified, accurate financial information</li>
            <li>✅ Be respectful and constructive in all discussions</li>
            <li>✅ Welcome and support newcomers</li>
            <li>❌ No spam, solicitation, or promotional content</li>
            <li>❌ No misinformation or guaranteed-return claims</li>
            <li>❌ No personal attacks or harassment</li>
          </ul>
        </div>

        {/* Form — UI-only, links to login */}
        <form
          className="mt-10 space-y-8"
          aria-label="New discussion form"
          noValidate
        >
          {/* Title */}
          <div>
            <label
              htmlFor="discussion-title"
              className="block text-sm font-semibold text-slate-300 mb-2"
            >
              Discussion Title <span aria-hidden="true" className="text-red-400">*</span>
            </label>
            <input
              id="discussion-title"
              type="text"
              name="title"
              required
              maxLength={200}
              className="w-full rounded-lg bg-slate-800 border border-slate-600 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-yellow-400 transition-colors"
              placeholder="Write a clear, descriptive title for your discussion"
              aria-required="true"
            />
            <p className="mt-1 text-xs text-slate-500">
              Be specific. Good titles attract better answers.
            </p>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="discussion-category"
              className="block text-sm font-semibold text-slate-300 mb-2"
            >
              Category <span aria-hidden="true" className="text-red-400">*</span>
            </label>
            <select
              id="discussion-category"
              name="category"
              required
              className="w-full rounded-lg bg-slate-800 border border-slate-600 px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
              aria-required="true"
            >
              <option value="">— Select a category —</option>
              {FORUM_CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="discussion-tags"
              className="block text-sm font-semibold text-slate-300 mb-2"
            >
              Tags
            </label>
            <input
              id="discussion-tags"
              type="text"
              name="tags"
              className="w-full rounded-lg bg-slate-800 border border-slate-600 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-yellow-400 transition-colors"
              placeholder="e.g. budgeting, debt-free, beginner (comma-separated)"
              aria-describedby="tags-hint"
            />
            <p id="tags-hint" className="mt-1 text-xs text-slate-500">
              Add up to 5 tags to help members find your discussion.
            </p>
          </div>

          {/* Body */}
          <div>
            <label
              htmlFor="discussion-body"
              className="block text-sm font-semibold text-slate-300 mb-2"
            >
              Discussion Body <span aria-hidden="true" className="text-red-400">*</span>
            </label>

            {/* Toolbar */}
            <div
              className="flex flex-wrap gap-2 mb-2 p-3 rounded-t-lg bg-slate-700 border border-slate-600 border-b-0"
              role="toolbar"
              aria-label="Rich text formatting toolbar"
            >
              {[
                { label: "Bold", symbol: "B", style: "font-bold" },
                { label: "Italic", symbol: "I", style: "italic" },
                { label: "Underline", symbol: "U", style: "underline" },
              ].map(({ label, symbol, style }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  className={`rounded px-3 py-1 text-sm bg-slate-600 hover:bg-slate-500 transition-colors text-white ${style}`}
                >
                  {symbol}
                </button>
              ))}
              <span className="border-l border-slate-500 mx-1" aria-hidden="true" />
              {[
                { label: "Ordered list", symbol: "1." },
                { label: "Unordered list", symbol: "•" },
                { label: "Quote", symbol: "❝" },
                { label: "Link", symbol: "🔗" },
              ].map(({ label, symbol }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  className="rounded px-3 py-1 text-sm bg-slate-600 hover:bg-slate-500 transition-colors text-white"
                >
                  {symbol}
                </button>
              ))}
            </div>

            <textarea
              id="discussion-body"
              name="body"
              rows={12}
              required
              className="w-full rounded-b-lg bg-slate-800 border border-slate-600 border-t-0 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-yellow-400 transition-colors resize-y"
              placeholder="Share your knowledge, experience, or question in detail. The more context you provide, the better the community can help."
              aria-required="true"
            />
          </div>

          {/* Submit */}
          <div className="flex flex-wrap gap-4 items-center pt-4 border-t border-slate-700">
            <Link
              href="/login"
              className="rounded-xl bg-yellow-400 px-8 py-4 font-bold text-black hover:bg-yellow-300 transition-colors"
            >
              Sign in to Post
            </Link>
            <Link
              href="/register"
              className="rounded-xl border border-white/20 px-8 py-4 font-bold text-white hover:border-white/50 transition-colors"
            >
              Create Account
            </Link>
            <p className="text-sm text-slate-500">
              You must be signed in to post discussions.
            </p>
          </div>
        </form>

      </section>
    </main>
  );
}
