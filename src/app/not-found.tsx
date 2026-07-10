import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Edunancial",
  description: "The page you requested could not be found.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#08101f] px-6 text-center text-white">
      <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
        404 — Page Not Found
      </p>

      <h1 className="mt-6 text-6xl font-black md:text-8xl">Oops.</h1>

      <p className="mx-auto mt-6 max-w-xl text-xl text-slate-300">
        The page you requested doesn&rsquo;t exist or may have moved. Let&rsquo;s get
        you back on track.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          Go Home
        </Link>
        <Link
          href="/courses"
          className="rounded-xl border border-white/30 px-8 py-4 text-lg font-bold hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Explore Courses
        </Link>
        <Link
          href="/assessment"
          className="rounded-xl border border-white/30 px-8 py-4 text-lg font-bold hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Take Assessment
        </Link>
      </div>
    </main>
  );
}
