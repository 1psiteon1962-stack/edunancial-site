import Link from "next/link";
import type { Metadata } from "next";
import DashboardNavCard from "@/components/dashboard/DashboardNavCard";

export const metadata: Metadata = {
  title: "Edunancial | Financial Education. Financial Competency. Financial Freedom.",
  description:
    "Edunancial helps individuals, families, entrepreneurs, and business owners build financial competency through real estate, paper assets, and business education. North America's financial education platform.",
  alternates: {
    canonical: "https://www.edunancial.com",
  },
  openGraph: {
    title: "Edunancial | Financial Education. Financial Competency. Financial Freedom.",
    description:
      "Build real financial competency — not just literacy. Master real estate, paper assets, and business. Serving North America.",
    url: "https://www.edunancial.com",
    type: "website",
  },
};

const dashboardCards = [
  {
    href: "/courses/white",
    icon: "📚",
    title: "Financial Literacy",
    description:
      "Budgeting, credit, cash flow, debt, and the foundational principles of personal finance.",
    accent: "blue",
  },
  {
    href: "/courses/white",
    icon: "📈",
    title: "Investing",
    description:
      "Stocks, ETFs, options, precious metals, retirement accounts, and paper asset strategies.",
    accent: "green",
  },
  {
    href: "/courses/white",
    icon: "💳",
    title: "Credit",
    description:
      "Understand, build, and leverage credit to unlock opportunities and reduce financial risk.",
    accent: "yellow",
  },
  {
    href: "/courses/red",
    icon: "🏠",
    title: "Real Estate",
    description:
      "Residential, commercial, tax liens, tax deeds, creative financing, and 1031 exchanges.",
    accent: "red",
  },
  {
    href: "/courses/blue",
    icon: "🚀",
    title: "Entrepreneurship",
    description:
      "Business structure, KPIs, pricing, cash flow, profit, leadership, and how to scale.",
    accent: "orange",
  },
  {
    href: "/ai",
    icon: "🤖",
    title: "AI Financial Coach",
    description:
      "Your personal AI coach — ask questions, get guidance, and accelerate your financial competency.",
    accent: "purple",
  },
  {
    href: "/courses",
    icon: "🎓",
    title: "Courses",
    description:
      "Structured financial education across real estate, paper assets, and business categories.",
    accent: "blue",
  },
  {
    href: "/books",
    icon: "📖",
    title: "Books",
    description:
      "Financial education books and resources curated to build competency at every level.",
    accent: "yellow",
  },
  {
    href: "/blog",
    icon: "✍️",
    title: "Blog",
    description:
      "Articles, insights, and strategies covering financial education and wealth-building topics.",
    accent: "white",
  },
  {
    href: "/community",
    icon: "👥",
    title: "Community",
    description:
      "Connect with learners, entrepreneurs, and investors who are building financial competency.",
    accent: "green",
  },
  {
    href: "/downloads",
    icon: "📥",
    title: "Resources",
    description:
      "Free downloads, worksheets, calculators, and tools to apply what you've learned.",
    accent: "orange",
  },
  {
    href: "/dashboard",
    icon: "👤",
    title: "Member Dashboard",
    description:
      "Track your progress, access your courses, and manage your financial competency journey.",
    accent: "blue",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      {/* ───── HERO ───── */}
      <section
        className="relative overflow-hidden bg-gradient-to-b from-[#08101f] via-[#0d1730] to-[#08101f]"
        aria-labelledby="hero-heading"
      >
        <div className="mx-auto max-w-5xl px-6 py-24 text-center sm:py-32">

          {/* Logo / wordmark */}
          <p className="text-4xl font-black" aria-label="Edunancial">
            <span className="text-red-500">Edu</span>
            <span className="text-white">nan</span>
            <span className="text-blue-400">cial</span>
          </p>

          <h1
            id="hero-heading"
            className="mt-8 text-4xl font-black leading-tight sm:text-5xl md:text-6xl"
          >
            Financial Education.{" "}
            <span className="text-blue-400">Financial Competency.</span>{" "}
            <span className="text-yellow-400">Financial Freedom.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
            Edunancial equips individuals, families, entrepreneurs, and business owners
            with the real-world financial education needed to build lasting wealth across
            real estate, paper assets, and business.
          </p>

          {/* Primary CTA buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              href="/membership"
              className="rounded-xl bg-yellow-400 px-7 py-4 text-base font-black text-black transition-colors hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 sm:text-lg"
            >
              Become a Member
            </Link>
            <Link
              href="/courses"
              className="rounded-xl bg-blue-600 px-7 py-4 text-base font-bold transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:text-lg"
            >
              Explore Courses
            </Link>
            <Link
              href="/ai"
              className="rounded-xl bg-purple-700 px-7 py-4 text-base font-bold transition-colors hover:bg-purple-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 sm:text-lg"
            >
              AI Financial Coach
            </Link>
            <Link
              href="/videos"
              className="rounded-xl border border-slate-500 px-7 py-4 text-base font-bold transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:text-lg"
            >
              Watch Introduction
            </Link>
          </div>

          {/* Trust strip */}
          <div className="mx-auto mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-500 sm:text-sm">
            <span>✓ Education only — not financial advice</span>
            <span>✓ Privacy protected — we never sell your data</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Serving US &amp; Canada</span>
          </div>

        </div>
      </section>

      {/* ───── OUR STORY (concise) ───── */}
      <section
        className="border-t border-slate-800 bg-[#111827]"
        aria-labelledby="story-heading"
      >
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.45em] text-yellow-400">
            Our Story
          </p>
          <h2
            id="story-heading"
            className="mt-4 text-3xl font-black sm:text-4xl"
          >
            Why Edunancial Exists
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Edunancial began as a conversation between a father and his eleven-year-old son.
            After watching a payment arrive electronically, his son asked,{" "}
            <em className="font-semibold text-white">&ldquo;Dad… how did you do that?&rdquo;</em>{" "}
            That question revealed a gap millions of people share — schools teach people to earn
            a paycheck, but rarely teach them to build wealth, evaluate investments, or create
            financial freedom.
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Our mission is to close that gap — providing structured financial education that
            moves people beyond literacy toward real{" "}
            <span className="font-bold text-white">financial competency</span>.
          </p>
          <div className="mt-3 text-slate-400 text-base">
            <span className="font-semibold text-slate-300">The problem:</span>{" "}
            Most people were never taught how money actually works — and they pay for it every day.
          </div>
          <div className="mt-8">
            <Link
              href="/why-edunancial"
              className="inline-flex items-center gap-2 rounded-xl border border-yellow-400 px-8 py-4 font-bold text-yellow-400 transition-colors hover:bg-yellow-400 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              Read the Full Story →
            </Link>
          </div>
        </div>
      </section>

      {/* ───── DASHBOARD NAVIGATION CARDS ───── */}
      <section
        className="border-t border-slate-800"
        aria-labelledby="dashboard-heading"
      >
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.45em] text-blue-400">
              Explore Edunancial
            </p>
            <h2
              id="dashboard-heading"
              className="mt-4 text-3xl font-black sm:text-4xl"
            >
              Where Do You Want to Go?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Choose your path — every area of financial competency is one click away.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {dashboardCards.map((card) => (
              <DashboardNavCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* ───── BOTTOM CTA ───── */}
      <section
        className="border-t border-slate-800 bg-gradient-to-r from-blue-950 via-[#0d1730] to-blue-950"
        aria-labelledby="cta-heading"
      >
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 id="cta-heading" className="text-3xl font-black sm:text-4xl">
            Ready to Build Financial Competency?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300">
            Start with a free assessment to discover your current competency level
            and receive a personalized learning roadmap.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/membership"
              className="rounded-xl bg-yellow-400 px-8 py-4 text-lg font-black text-black transition-colors hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              Become a Member
            </Link>
            <Link
              href="/assessment"
              className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Take Free Assessment
            </Link>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Educational content only — not financial advice.{" "}
            <Link href="/disclaimer" className="underline hover:text-slate-400">
              See disclaimer
            </Link>
            .
          </p>
        </div>
      </section>

    </main>
  );
}
