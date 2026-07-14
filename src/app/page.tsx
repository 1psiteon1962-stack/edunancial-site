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
      "inline-flex items-center justify-center rounded-xl bg-yellow-400 px-6 py-4 text-base font-black text-black transition hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
  },
  {
    href: "/pricing",
    label: "View Membership Plans",
    className:
      "inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
  },
  {
    href: "/login",
    label: "Log In",
    className:
      "inline-flex items-center justify-center rounded-xl border border-white/60 px-6 py-4 text-base font-bold transition hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
  },
];

const dashboardCards = [
  {
    title: "Financial Literacy",
    description: "Budgeting, cash flow, saving, and financial fundamentals.",
    href: "/courses/white-paper-assets",
  },
  {
    title: "Real Estate",
    description: "Creative finance, tax liens, rentals, and long-term asset building.",
    href: "/courses/red-real-estate",
  },
  {
    title: "Entrepreneurship",
    description: "Profit, pricing, KPIs, leadership, and business growth.",
    href: "/courses/blue-business",
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
            <div className="mt-6 max-w-3xl space-y-4 text-lg leading-8 text-slate-300">
              <p>Edunancial began with a conversation between a father and his 11-year-old son.</p>

              <p>
                One day I had just finished working on a file when my phone alerted me that a
                client payment had arrived. My son happened to walk into the room at that exact
                moment. Looking at the amount, he asked a simple question:
              </p>

              <p>
                <strong>"Dad, how did you do that?"</strong>
              </p>

              <p>I answered,</p>

              <p>
                <strong>"Because I work with my head."</strong>
              </p>

              <p>He looked surprised, so I asked him another question:</p>

              <p>
                <strong>"Would you like to work with your head someday?"</strong>
              </p>

              <p>Without hesitation he answered,</p>

              <p>
                <strong>"Yes... but I don't know how."</strong>
              </p>

              <p>That was the moment Edunancial was born.</p>

              <p>
                Over the next four years, I began teaching him a simple system that an 11-year-old
                could understand.
              </p>

              <p>
                <strong>RED</strong> represented <strong>Real Estate.</strong>
              </p>

              <p>
                <strong>WHITE</strong> represented <strong>Paper Assets</strong>—stocks, bonds,
                ETFs, options, and other investments.
              </p>

              <p>
                <strong>BLUE</strong> represented <strong>Business</strong>—how businesses are
                built, operated, managed, and grown profitably.
              </p>

              <p>
                What started as a way to teach my own son soon revealed something much larger.
              </p>

              <p>
                It became apparent to me that millions of people—children, adults,
                entrepreneurs, and even experienced professionals—were asking the very same
                question:
              </p>

              <p>
                <strong>
                  "I want to work with my head... but nobody has shown me how."
                </strong>
              </p>

              <p>Most people are taught financial vocabulary.</p>

              <p>Very few are taught financial systems.</p>

              <p>
                At Edunancial, we believe wealth is rarely created by luck. It is built by
                following sound systems, making informed decisions, understanding cash flow,
                protecting capital, managing risk, and thinking long term.
              </p>

              <p>Financial literacy provides knowledge.</p>

              <p>
                Financial competency is the ability to consistently apply that knowledge in the
                real world.
              </p>

              <p>That difference changes lives.</p>

              <p>
                Edunancial was created to help people move beyond memorizing financial terms and
                begin building practical financial judgment through structured learning,
                measurable progress, artificial intelligence, and real-world application.
              </p>

              <p>Our mission is simple:</p>

              <p>
                <strong>
                  Teach people how to think—not what to think—so they can make better financial
                  decisions for the rest of their lives.
                </strong>
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/our-story"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Read Our Story
              </Link>
              <Link
                href="/mission"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-4 font-bold text-white transition hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
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
            className="font-bold text-blue-300 hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            Preview the member dashboard &rarr;
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 transition hover:border-blue-400 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
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

      {/* ── Section 5: Who Edunancial Is For ─────────────────────────── */}
      <section aria-labelledby="homepage-audience-heading" className="border-t border-white/10 bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">
            Who This Is For
          </p>
          <h2 id="homepage-audience-heading" className="mt-4 text-3xl font-black sm:text-4xl md:text-5xl max-w-4xl">
            Edunancial is built for working people who want to improve their financial future one decision at a time.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Designed primarily for L1 and L2 beginners — working families, working professionals,
            beginning investors, and beginning entrepreneurs. As competency grows, the platform
            continues with you into L3, L4, and L5.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Working Families", "Build a financially literate household. Teach your children alongside yourself."],
              ["Working Professionals", "Fill the gaps your formal education left. Apply new knowledge to real decisions."],
              ["Beginning Investors", "Start with the foundations before the strategies. Competency before capital."],
              ["Beginning Entrepreneurs", "Learn the financial side of business ownership before the common mistakes become expensive."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: Philosophy ─────────────────────────────────────── */}
      <section aria-labelledby="homepage-philosophy-heading" className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-blue-400">
            How We Teach
          </p>
          <h2 id="homepage-philosophy-heading" className="mt-4 text-3xl font-black sm:text-4xl md:text-5xl max-w-4xl">
            Teach HOW to think. Never tell people WHAT to think.
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
            {["Learn", "Think", "Practice", "Improve", "Repeat"].map((step) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <p className="text-2xl font-black text-white">{step}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-base leading-7 text-slate-400">
            Financial literacy provides knowledge. Financial competency is built through
            disciplined practice over time. The goal is not to change your opinion in one
            lesson — it is to change your thinking over a lifetime.
          </p>
        </div>
      </section>

      {/* ── Section 7: Free Trial placeholder ───────────────────────────── */}
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

      {/* ── Section 8: Membership ────────────────────────────────────────── */}
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
                className="inline-flex items-center justify-center rounded-2xl bg-yellow-400 px-6 py-5 text-center font-black text-slate-950 transition hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Start Membership
              </Link>
              <Link
                href="/ai-coach"
                className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-6 py-5 text-center font-bold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
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
