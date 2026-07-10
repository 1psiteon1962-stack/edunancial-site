import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { isLoggedIn } from "@/lib/auth";

const primaryCallsToAction = [
  {
    href: "/membership",
    label: "Become a Member",
    className:
      "rounded-xl bg-yellow-400 px-6 py-4 text-lg font-black text-black transition hover:bg-yellow-300",
  },
  {
    href: "/login",
    label: "Log In",
    className:
      "rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-blue-700",
  },
  {
    href: "/courses",
    label: "Explore Courses",
    className:
      "rounded-xl border border-white/60 px-6 py-4 text-lg font-bold transition hover:bg-white hover:text-slate-950",
  },
  {
    href: "/ai-coach",
    label: "Meet the AI Financial Coach",
    className:
      "rounded-xl border border-blue-400 bg-blue-400/10 px-6 py-4 text-lg font-bold text-blue-200 transition hover:bg-blue-400/20",
  },
];

const dashboardCards = [
  {
    title: "Financial Literacy",
    description: "Budgeting, cash flow, saving, and financial fundamentals.",
    href: "/courses/white",
  },
  {
    title: "Investing",
    description: "Stocks, ETFs, retirement, precious metals, and risk management.",
    href: "/courses/white",
  },
  {
    title: "Credit",
    description: "Credit fundamentals, debt strategy, and borrowing decisions.",
    href: "/courses/white",
  },
  {
    title: "Real Estate",
    description: "Creative finance, tax liens, rentals, and long-term asset building.",
    href: "/courses/red",
  },
  {
    title: "Entrepreneurship",
    description: "Profit, pricing, KPIs, leadership, and business growth.",
    href: "/courses/blue",
  },
  {
    title: "AI Financial Coach",
    description: "Get guided next steps, recommendations, and on-demand support.",
    href: "/ai-coach",
  },
  {
    title: "Courses",
    description: "Browse Edunancial learning paths across every wealth-building pillar.",
    href: "/courses",
  },
  {
    title: "Books",
    description: "Explore books, workbooks, and supporting learning resources.",
    href: "/books",
  },
  {
    title: "Blog",
    description: "Read insights, updates, and practical financial education content.",
    href: "/blog",
  },
  {
    title: "Community",
    description: "Stay connected with other learners, families, and builders.",
    href: "/community",
  },
  {
    title: "Resources",
    description: "Access downloads, tools, and practice materials in one place.",
    href: "/downloads",
  },
  {
    title: "Member Dashboard",
    description: "Jump into progress tracking, saved resources, and member tools.",
    href: "/dashboard",
  },
];

const informationArchitectureLinks = [
  {
    title: "Our Story",
    description: "Learn why Edunancial exists and how the mission began.",
    href: "/our-story",
  },
  {
    title: "Mission",
    description: "See the practical objective behind the platform.",
    href: "/mission",
  },
  {
    title: "Vision",
    description: "Understand the long-term platform direction and member experience.",
    href: "/vision",
  },
  {
    title: "Features",
    description: "Review the tools, learning systems, and dashboard capabilities.",
    href: "/features",
  },
  {
    title: "FAQ",
    description: "Get answers about memberships, courses, certificates, and access.",
    href: "/faq",
  },
  {
    title: "Pricing",
    description: "Compare membership options and choose the right starting point.",
    href: "/pricing",
  },
  {
    title: "Privacy & Security",
    description: "Review how Edunancial protects member data and trust.",
    href: "/privacy",
  },
  {
    title: "Contact",
    description: "Reach the right team for support, billing, partnerships, or press.",
    href: "/contact",
  },
];

export const metadata: Metadata = {
  title: "Edunancial Dashboard | Financial Education, Competency & Freedom",
  description:
    "Explore Edunancial through a dashboard-first experience. Discover courses, the AI Financial Coach, member tools, and the mission behind practical financial competency.",
  alternates: {
    canonical: "https://www.edunancial.com",
  },
  openGraph: {
    title: "Edunancial Dashboard | Financial Education, Competency & Freedom",
    description:
      "Navigate courses, membership, financial tools, and the AI Financial Coach from Edunancial’s dashboard-first homepage.",
    url: "https://www.edunancial.com",
    type: "website",
  },
};

export default function HomePage() {
  if (isLoggedIn()) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-[#08101f] via-[#0d1730] to-[#08101f]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
              Edunancial
            </p>
            <h1 className="mt-8 text-5xl font-black leading-tight md:text-7xl">
              Financial Education.
              <br />
              Financial Competency.
              <br />
              Financial Freedom.
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
              Edunancial helps individuals, families, and entrepreneurs move from learning
              financial concepts to applying them with confidence through courses, tools,
              and guided next steps.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              {primaryCallsToAction.map((cta) => (
                <Link key={cta.label} href={cta.href} className={cta.className}>
                  {cta.label}
                </Link>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-slate-400">
              <span>Two-click navigation to every major section</span>
              <span>Mobile-first dashboard experience</span>
              <span>SEO-friendly dedicated content pages</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 rounded-3xl border border-white/10 bg-slate-950/50 p-8 md:p-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">
              Our Story
            </p>
            <h2 className="mt-6 text-4xl font-black md:text-5xl">Why Edunancial exists</h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Edunancial began with a simple problem: too many people learn financial terms
              without ever being shown how to make real financial decisions. The platform was
              created to close that gap with practical education, measurable progress, and
              member experiences built for long-term growth.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/our-story"
                className="rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700"
              >
                Read Our Story
              </Link>
              <Link
                href="/mission"
                className="rounded-xl border border-white/20 px-6 py-4 font-bold text-white transition hover:bg-white hover:text-slate-950"
              >
                Mission &amp; Vision
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {[
              ["Why we exist", "To turn financial education into applied financial competency."],
              ["The mission", "Make practical wealth-building education clear, useful, and accessible."],
              ["The problem", "Too much theory, not enough guided action or accountability."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">
              Public Dashboard
            </p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Navigate every major area in two clicks or less
            </h2>
          </div>
          <Link href="/dashboard" className="font-bold text-blue-300 hover:text-blue-200">
            Preview the member dashboard &rarr;
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 transition hover:border-blue-400 hover:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl font-black">{card.title}</h3>
                <span aria-hidden="true" className="text-blue-300">
                  &rarr;
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0b1326]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">
              Explore More
            </p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Dedicated pages for the information you used to scroll for
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Long-form homepage content has been broken into focused pages so visitors can
              find the right answer faster without losing search visibility or context.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {informationArchitectureLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 transition hover:border-yellow-400"
              >
                <h3 className="text-xl font-black">{link.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl border border-blue-500/30 bg-blue-500/10 p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.4em] text-blue-300">
                Conversion Focus
              </p>
              <h2 className="mt-4 text-4xl font-black md:text-5xl">
                Start free, become a member, or continue where you left off
              </h2>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                Visitors can discover the platform quickly, while returning members have a
                clear path to learning progress, AI coaching, saved resources, and upcoming
                events.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/register"
                className="rounded-2xl bg-yellow-400 px-6 py-5 text-center font-black text-slate-950 transition hover:bg-yellow-300"
              >
                Become a Member
              </Link>
              <Link
                href="/login"
                className="rounded-2xl bg-white/10 px-6 py-5 text-center font-bold text-white transition hover:bg-white/20"
              >
                Log In
              </Link>
              <Link
                href="/courses"
                className="rounded-2xl bg-white/10 px-6 py-5 text-center font-bold text-white transition hover:bg-white/20"
              >
                Explore Courses
              </Link>
              <Link
                href="/ai-coach"
                className="rounded-2xl bg-white/10 px-6 py-5 text-center font-bold text-white transition hover:bg-white/20"
              >
                Meet the AI Financial Coach
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
