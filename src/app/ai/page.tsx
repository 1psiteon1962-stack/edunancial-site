import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Assistant | Edunancial",
  description: "Access your Edunancial AI Financial Tutor.",
};

export default function AIPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">
          AI Financial Education
        </p>
        <h1 className="mt-4 text-5xl font-black">
          Edunancial AI Tutor
        </h1>
        <p className="mt-6 text-xl text-slate-300">
          Your personalized financial education coach — powered by AI.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/ai-tutor"
            className="rounded-xl bg-yellow-500 px-8 py-4 text-lg font-bold text-slate-900 transition hover:bg-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            Open AI Tutor →
          </Link>
          <Link
            href="/courses"
            className="rounded-xl border border-slate-700 px-8 py-4 text-lg font-semibold text-white transition hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    </main>
  );
}
