import type { Metadata } from "next";
import Link from "next/link";

import { helpCategories } from "@/data/help-articles";

export const metadata: Metadata = {
  title: "Support Center",
};

const supportOptions = [
  {
    title: "Submit a Ticket",
    description:
      "Reach our human support team for billing, courses, technical issues, or account help.",
    href: "/support/new",
  },
  {
    title: "View My Tickets",
    description:
      "Track open conversations, response updates, and ticket history in one place.",
    href: "/support/tickets",
  },
  {
    title: "Knowledge Base",
    description:
      "Explore guides, troubleshooting articles, and common answers before contacting support.",
    href: "/knowledge-base",
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="max-w-7xl mx-auto px-6 py-24">
        <p className="text-yellow-400 uppercase tracking-[0.45em] font-bold text-sm">
          SUPPORT
        </p>

        <h1 className="mt-6 text-5xl font-black md:text-6xl">Support Center</h1>

        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          Find answers fast, open a ticket, or browse helpful resources built for
          Edunancial members.
        </p>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {supportOptions.map((option) => (
            <Link
              key={option.href}
              href={option.href}
              className="rounded-xl bg-slate-900 p-8 border border-white/10 transition hover:border-blue-500"
            >
              <h2 className="text-2xl font-black">{option.title}</h2>
              <p className="mt-4 text-slate-300">{option.description}</p>
              <span className="mt-8 inline-flex text-blue-400 font-bold">
                Explore option →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-yellow-400 uppercase tracking-[0.45em] font-bold text-sm">
              COMMON TOPICS
            </p>
            <h2 className="mt-4 text-4xl font-black">Popular help categories</h2>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {helpCategories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              href={`/help/${category.slug}`}
              className="rounded-xl bg-[#101a2f] p-8 border border-white/10 transition hover:border-blue-500"
            >
              <div className="text-3xl" aria-hidden="true">
                {category.icon}
              </div>
              <h3 className="mt-4 text-2xl font-black">{category.name}</h3>
              <p className="mt-3 text-slate-300">{category.description}</p>
              <p className="mt-6 text-sm text-slate-400">
                {category.articleCount} articles available
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="rounded-xl bg-slate-900 p-8 border border-white/10">
          <p className="text-yellow-400 uppercase tracking-[0.45em] font-bold text-sm">
            AI ASSISTANT
          </p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-black">AI support is coming soon</h2>
              <p className="mt-4 text-slate-300">
                We&apos;re building an AI assistant to help surface answers faster.
                Until then, human support is always available for every member.
              </p>
            </div>
            <Link
              href="/support/new"
              className="rounded-lg bg-blue-600 px-5 py-3 font-bold hover:bg-blue-500 text-center"
            >
              Talk to support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
