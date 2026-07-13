import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { isLoggedIn } from "@/lib/auth";
import {
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_LONG_DESCRIPTION,
  EDUNANCIAL_METHODS_CLARIFICATION,
  RED_WHITE_BLUE_FOUNDATION,
} from "@/lib/positioning";
import MemberSuccessStories from "@/components/home/MemberSuccessStories";

const primaryCallsToAction = [
  {
    href: "/register",
    label: "Become a Member",
    className:
      "inline-flex items-center justify-center rounded-xl bg-yellow-400 px-6 py-4 text-base font-black text-black transition hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08101f]",
  },
  {
    href: "/pricing",
    label: "View Membership Plans",
    className:
      "inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08101f]",
  },
  {
    href: "/login",
    label: "Log In",
    className:
      "inline-flex items-center justify-center rounded-xl border border-white/60 px-6 py-4 text-base font-bold transition hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#08101f]",
  },
];

const dashboardCards = [
  {
    title: "Financial Literacy",
    description: "Budgeting, cash flow, saving, and financial fundamentals.",
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

export const metadata: Metadata = {
  title: "Edunancial | Financial Literacy & Financial Competency Membership Platform",
  description: EDUNANCIAL_LONG_DESCRIPTION,
  keywords: [
    "financial competency platform",
    "financial literacy membership",
    "real estate knowledge",
    "investment knowledge",
    "business competency",
    "AI financial coach",
    "practical financial knowledge",
  ],
  alternates: {
    canonical: "https://www.edunancial.com",
  },
  openGraph: {
    title: "Edunancial | Financial Literacy & Financial Competency Membership Platform",
    description: EDUNANCIAL_LONG_DESCRIPTION,
    url: "https://www.edunancial.com",
    siteName: "Edunancial",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Edunancial financial competency learning platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edunancial | Financial Literacy & Financial Competency Membership Platform",
    description: EDUNANCIAL_IDENTITY,
    images: ["/og-image.png"],
  },
};

export default function HomePage() {
  if (isLoggedIn()) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      {/* ── Section 1: Why Edunancial? ───────────────────────────────────── */}
      <section aria-labelledby="homepage-story-heading" className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-10 rounded-3xl border border-white/10 bg-slate-950/50 p-8 md:p-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">
              Our Story
            </p>
            <h2 id="homepage-story-heading" className="mt-6 text-3xl font-black sm:text-4xl md:text-5xl">
              Why Edunancial?
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Edunancial began with a simple problem: too many people learn financial terms
              without ever being shown how to make real financial decisions. The platform was
              created to close that gap with structured learning resources, measurable progress,
              and member experiences built for long-term growth.
            </p>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">
              {RED_WHITE_BLUE_FOUNDATION}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/our-story"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08101f]"
              >
                Read Our Story
              </Link>
              <Link
                href="/mission"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-4 font-bold text-white transition hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#08101f]"
              >
                Mission &amp; Vision
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {[
              ["Why we exist", "To turn financial literacy into applied financial competency."],
              ["The mission", "Make practical wealth-building knowledge clear, useful, and accessible."],
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

      {/* ── Section 2: What is Edunancial? ───────────────────────────────── */}
      <section
        aria-labelledby="homepage-hero-heading"
        className="border-b border-white/10 bg-gradient-to-b from-[#08101f] via-[#0d1730] to-[#08101f]"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.45em] text-yellow-300 md:text-sm">
              Edunancial
            </p>
            <h1 id="homepage-hero-heading" className="mt-6 text-4xl font-black leading-tight sm:text-5xl md:text-7xl">
              What is Edunancial?
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8 md:text-xl">
              {EDUNANCIAL_LONG_DESCRIPTION}
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
              {EDUNANCIAL_METHODS_CLARIFICATION}
            </p>
            <div className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {primaryCallsToAction.map((cta) => (
                <Link key={cta.label} href={cta.href} className={cta.className}>
                  {cta.label}
                </Link>
              ))}
            </div>
            <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                Invitation-only beta access remains hidden from public pricing
              </span>
              <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                Color-coded financial literacy modules across Red, White, and Blue
              </span>
              <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                AI-guided next steps for better decisions
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Member Success Stories ───────────────────────────── */}
      <MemberSuccessStories stories={[]} />

      {/* ── Section 4: Navigate Every Major Area ────────────────────────── */}
      <section aria-labelledby="homepage-dashboard-heading" className="mx-auto max-w-7xl px-6 pb-16 md:pb-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">
              Public Dashboard
            </p>
            <h2 id="homepage-dashboard-heading" className="mt-4 text-3xl font-black sm:text-4xl md:text-5xl">
              Navigate every major area in two clicks or less
            </h2>
          </div>
          <Link
            href="/dashboard"
            className="font-bold text-blue-300 hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08101f]"
          >
            Preview the member dashboard &rarr;
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 transition hover:border-blue-400 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08101f]"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-black sm:text-2xl">{card.title}</h3>
                <span aria-hidden="true" className="text-blue-300">
                  &rarr;
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Section 5: Free Trial placeholder ───────────────────────────── */}
      {/* Free Trial section — content will be added in a future update */}
      <section aria-label="Free trial" className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-slate-400">
              Free Trial
            </p>
            <p className="mt-2 text-slate-500 text-sm">Coming soon</p>
          </div>
        </div>
      </section>

      {/* ── Section 6: Membership ────────────────────────────────────────── */}
      <section aria-labelledby="homepage-final-cta-heading" className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="rounded-3xl border border-blue-500/30 bg-blue-500/10 p-8 md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.4em] text-blue-300">
                Ready to Start
              </p>
              <h2 id="homepage-final-cta-heading" className="mt-4 text-3xl font-black sm:text-4xl md:text-5xl">
                Become a member and build momentum this week
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
                Join to unlock structured learning paths, progress tracking, member tools, and
                AI-guided support that helps you make better financial decisions faster.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-yellow-400 px-6 py-5 text-center font-black text-slate-950 transition hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08101f]"
              >
                Start Membership
              </Link>
              <Link
                href="/ai-coach"
                className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-6 py-5 text-center font-bold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#08101f]"
              >
                Try the AI Financial Coach
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
