import Link from "next/link";

import { currentUser } from "@/lib/auth";

const sidebarItems = ["Dashboard", "My Learning", "Assessments", "Certificates", "AI Financial Coach", "Books", "Progress"];

const placeholderCards = ["My Learning", "Assessments", "Certificates", "AI Financial Coach", "Books", "Progress"];

export const metadata = {
  title: "Member Dashboard | Edunancial",
  description: "Phase 1 member dashboard shell with navigation and placeholder cards.",
};

export default function DashboardPage() {
  const user = currentUser();
  const firstName = user?.firstName ?? "Member";

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-yellow-400">Member Area</p>
              <h1 className="mt-2 text-2xl font-black sm:text-3xl">Welcome, {firstName}</h1>
            </div>
            <nav className="flex flex-wrap items-center gap-3 text-sm font-bold">
              <Link href="/" className="rounded-lg border border-white/15 px-3 py-2 text-slate-200 hover:text-white">
                Home
              </Link>
              <Link href="/courses" className="rounded-lg border border-white/15 px-3 py-2 text-slate-200 hover:text-white">
                Courses
              </Link>
              <Link href="/ai-coach" className="rounded-lg border border-white/15 px-3 py-2 text-slate-200 hover:text-white">
                AI Coach
              </Link>
            </nav>
          </div>
        </header>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <aside className="w-full rounded-2xl border border-white/10 bg-slate-900/80 p-4 lg:w-64 lg:flex-none">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Navigation</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {sidebarItems.map((item) => (
                <li key={item} className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200">
                  {item}
                </li>
              ))}
            </ul>
          </aside>

          <div className="flex-1">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {placeholderCards.map((title) => (
                <article key={title} className="min-h-36 rounded-2xl border border-white/10 bg-slate-900/80 p-5">
                  <h2 className="text-lg font-black">{title}</h2>
                </article>
              ))}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
