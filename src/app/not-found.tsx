import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Edunancial",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#08101f] px-6 text-center text-white">
      <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">404</p>
      <h1 className="mt-6 text-5xl font-black">Page Not Found</h1>
      <p className="mt-6 max-w-xl text-lg text-slate-300">
        The page you requested does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
      >
        Return to Home
      </Link>
    </main>
  );
}
