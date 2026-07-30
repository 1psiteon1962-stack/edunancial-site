import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Script from "next/script";

import GlossaryTerm from "@/components/courses/GlossaryTerm";
import { EDUNANCIAL_PUBLIC_DISCLAIMER, EDUNANCIAL_METHODS_CLARIFICATION } from "@/lib/positioning";

// ─────────────────────────────────────────────────────────────
// Metadata & SEO
// ─────────────────────────────────────────────────────────────

const SITE_URL = "https://www.edunancial.com";
const CANONICAL = `${SITE_URL}/courses/red-real-estate/lessons/red-01`;

export const metadata: Metadata = {
  title: "RED 101: What Is Real Estate? | Edunancial",
  description:
    "Learn what real estate is, how it generates wealth through cash flow and appreciation, the major investment categories, and the key advantages and disadvantages of real estate as an asset class.",
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: "RED 101: What Is Real Estate?",
    description:
      "Define real estate as an asset class and understand how ownership generates wealth. Lesson 1 of the RED Real Estate Competency track.",
    url: CANONICAL,
    siteName: "Edunancial",
    type: "article",
    images: [
      {
        url: `${SITE_URL}/images/og/red-101-what-is-real-estate.jpg`,
        width: 1200,
        height: 630,
        alt: "RED 101: What Is Real Estate? — Edunancial",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RED 101: What Is Real Estate? | Edunancial",
    description:
      "Lesson 1 of the Edunancial RED Real Estate track. Understand what real estate is and how it builds wealth.",
  },
};

// ─────────────────────────────────────────────────────────────
// Static lesson content (translation-ready data object)
// ─────────────────────────────────────────────────────────────

const LESSON = {
  track: "RED — Real Estate",
  courseTitle: "RED: Real Estate Competency",
  courseId: "red-real-estate",
  lessonId: "red-01",
  lessonNumber: 1,
  totalLessons: 6,
  title: "RED 101: What Is Real Estate?",
  duration: "18 min",
  overview:
    "Real estate is the ownership of land and any structures permanently attached to it. It is one of the oldest, most widely held, and most misunderstood wealth-building tools. Before you can invest intelligently, you must understand exactly what real estate is, why it builds wealth, and how it compares to other asset classes.",

  whatYouWillLearn: [
    "Define real estate as a distinct asset class",
    "Understand the five major categories of real estate",
    "Explain how ownership generates wealth through cash flow and appreciation",
    "Identify the key advantages and disadvantages of real estate investing",
    "Recognize important glossary terms used throughout the RED track",
    "Avoid the most common beginner mistakes",
  ],

  categories: [
    {
      name: "Residential",
      description:
        "Single-family homes, duplexes, triplexes, condominiums, and multi-family properties up to four units. This is where most investors start.",
    },
    {
      name: "Commercial",
      description:
        "Office buildings, retail centers, strip malls, and mixed-use developments. Income is typically tied to business tenants on longer leases.",
    },
    {
      name: "Industrial",
      description:
        "Warehouses, distribution centers, manufacturing plants, and flex space. Demand has grown significantly with e-commerce expansion.",
    },
    {
      name: "Raw Land",
      description:
        "Undeveloped parcels purchased for future construction, agricultural use, or appreciation. Lower barrier to entry but produces no immediate income.",
    },
    {
      name: "REITs (Real Estate Investment Trusts)",
      description:
        "Publicly traded companies that own income-producing real estate. REITs offer liquidity and low capital requirements at the cost of direct control.",
    },
  ],

  wealthMechanisms: {
    cashFlow: {
      title: "Cash Flow",
      description:
        "The monthly income remaining after all expenses (mortgage, taxes, insurance, maintenance, vacancy) are subtracted from rental income. Positive cash flow means the property pays you every month. Building cash flow is the core objective of the RED track.",
    },
    appreciation: {
      title: "Appreciation",
      description:
        "The increase in a property's market value over time. Appreciation can be natural (driven by supply and demand in the market) or forced (driven by improvements you make to the property). While appreciation is not guaranteed, real estate has historically increased in value over long time horizons.",
    },
    leverage: {
      title: "Leverage",
      description:
        "The ability to use borrowed money (a mortgage) to control a large asset with a small down payment. A 20% down payment lets you control 100% of the asset. When the property appreciates or generates income, your return is calculated on the full value — not just your down payment.",
    },
    taxBenefits: {
      title: "Tax Benefits",
      description:
        "Real estate investors can deduct mortgage interest, property taxes, insurance, repairs, depreciation, and management fees. The 1031 Exchange allows investors to defer capital gains taxes indefinitely when reinvesting proceeds into like-kind property.",
    },
  },

  keyTakeaways: [
    "Real estate is a tangible asset class defined by ownership of land and structures.",
    "Wealth is built through four mechanisms: cash flow, appreciation, leverage, and tax benefits.",
    "The five major categories are residential, commercial, industrial, raw land, and REITs.",
    "Cash flow is income minus expenses — prioritize positive cash flow over speculation.",
    "Leverage amplifies both gains and losses — understand it before using it.",
    "Illiquidity is real estate's biggest limitation; plan holding periods accordingly.",
    "REITs provide exposure to real estate without direct ownership but sacrifice control.",
  ],

  commonMistakes: [
    {
      mistake: "Confusing appreciation with income",
      detail:
        "Appreciation is a future event — you cannot spend it until you sell. Investors who count on appreciation alone to fund losses often run out of cash. Focus on cash flow first.",
    },
    {
      mistake: "Underestimating expenses",
      detail:
        "New investors routinely forget vacancy, maintenance, capital expenditures (roof, HVAC, plumbing), property management, and insurance. Always underwrite with realistic expense assumptions.",
    },
    {
      mistake: "Over-leveraging",
      detail:
        "Leverage accelerates wealth creation but also magnifies losses. Borrowing too much leaves you vulnerable when vacancies rise or values drop. Maintain adequate reserves.",
    },
    {
      mistake: "Skipping due diligence",
      detail:
        "Purchasing a property without a proper inspection, title search, or market analysis is a common and costly error. Every dollar saved on due diligence can cost ten in surprises.",
    },
    {
      mistake: "Treating real estate as passive income from day one",
      detail:
        "Real estate is an active business until you build sufficient scale and systems. Property management, tenant relations, and maintenance require time and attention — especially at the start.",
    },
  ],

  faqs: [
    {
      question: "Do I need a lot of money to start investing in real estate?",
      answer:
        "Not necessarily. While direct property ownership typically requires a down payment (often 20% for investment properties), strategies like house hacking, seller financing, and REITs can lower the capital barrier significantly. The RED track covers multiple low-capital entry strategies.",
    },
    {
      question: "Is real estate better than stocks?",
      answer:
        "Real estate and stocks (paper assets) serve different purposes in a wealth-building strategy. Real estate offers leverage, cash flow, and tax advantages that stocks cannot replicate. Stocks offer liquidity and diversification that real estate cannot match. The most financially competent investors understand both and deploy capital deliberately.",
    },
    {
      question: "What is the difference between cash flow and appreciation?",
      answer:
        "Cash flow is income your property generates right now — every month. Appreciation is the increase in the property's value over time, which you realize when you sell. Savvy investors prioritize cash flow because it is immediate, measurable, and reliable. Appreciation is a bonus, not a strategy.",
    },
    {
      question: "What is a REIT?",
      answer:
        "A Real Estate Investment Trust (REIT) is a company that owns income-producing real estate and trades on major stock exchanges. REITs are required to distribute at least 90% of taxable income to shareholders. They offer real estate exposure with stock-like liquidity — but without the direct ownership, leverage, or tax depreciation benefits.",
    },
    {
      question: "What does illiquidity mean for real estate investors?",
      answer:
        "Illiquidity means you cannot quickly convert a real estate investment into cash without potentially accepting a lower price or waiting months for a sale. Unlike stocks, which can be sold in seconds, real estate requires finding a buyer, completing due diligence, and closing a transaction. Investors must plan for this when managing cash reserves and holding periods.",
    },
    {
      question: "Is this real estate investing advice?",
      answer:
        "No. Edunancial is a financial literacy and competency education platform. All content in the RED track is educational. Nothing in this lesson or any Edunancial lesson constitutes investment, legal, tax, or financial advice. Consult qualified professionals before making real estate decisions.",
    },
  ],

  nextLesson: {
    id: "red-02",
    title: "Rental Properties: Cash Flow Analysis",
    href: "/courses/red-real-estate/lessons/red-02",
  },
} as const;

// ─────────────────────────────────────────────────────────────
// Structured Data
// ─────────────────────────────────────────────────────────────

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Courses",
          item: `${SITE_URL}/courses`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "RED: Real Estate Competency",
          item: `${SITE_URL}/courses/red-real-estate`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: LESSON.title,
          item: CANONICAL,
        },
      ],
    },
    {
      "@type": "Article",
      "@id": CANONICAL,
      headline: LESSON.title,
      description: metadata.description,
      url: CANONICAL,
      inLanguage: "en-US",
      isPartOf: {
        "@type": "Course",
        name: LESSON.courseTitle,
        url: `${SITE_URL}/courses/${LESSON.courseId}`,
        provider: {
          "@type": "Organization",
          name: "Edunancial",
          url: SITE_URL,
        },
      },
      educationalLevel: "Beginner",
      learningResourceType: "Lesson",
      about: [
        { "@type": "DefinedTerm", name: "Real Estate", inDefinedTermSet: "Financial Literacy" },
        { "@type": "DefinedTerm", name: "Cash Flow" },
        { "@type": "DefinedTerm", name: "Appreciation" },
        { "@type": "DefinedTerm", name: "Leverage" },
        { "@type": "DefinedTerm", name: "REIT" },
        { "@type": "DefinedTerm", name: "Illiquidity" },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// Sub-components (server-rendered, no client JS needed)
// ─────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-black md:text-3xl">{children}</h2>;
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900 p-6 ${className}`}>
      {children}
    </div>
  );
}

function Placeholder({
  label,
  icon,
  description,
}: {
  label: string;
  icon: string;
  description: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/50 py-12 text-center"
      aria-label={label}
      role="img"
    >
      <span className="text-4xl" aria-hidden="true">{icon}</span>
      <p className="text-sm font-bold uppercase tracking-widest text-slate-500">{label}</p>
      <p className="max-w-xs text-xs text-slate-600">{description}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default function Red101Page() {
  return (
    <>
      <Script
        id="red-101-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-[#08101f] text-white" id="main-content">
        {/* ── Hero ────────────────────────────────────────────── */}
        <section
          className="border-b border-slate-800 bg-gradient-to-br from-slate-900 to-[#08101f]"
          aria-labelledby="lesson-title"
        >
          <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-400">
                <li>
                  <Link href="/courses" className="hover:text-white transition-colors">
                    Courses
                  </Link>
                </li>
                <li aria-hidden="true" className="select-none">/</li>
                <li>
                  <Link
                    href="/courses/red-real-estate"
                    className="hover:text-white transition-colors"
                  >
                    {LESSON.courseTitle}
                  </Link>
                </li>
                <li aria-hidden="true" className="select-none">/</li>
                <li className="text-slate-200" aria-current="page">
                  {LESSON.title}
                </li>
              </ol>
            </nav>

            {/* Eyebrow */}
            <p className="text-xs font-black uppercase tracking-[0.45em] text-yellow-400">
              {LESSON.track} · Lesson {LESSON.lessonNumber} of {LESSON.totalLessons}
            </p>

            {/* Title */}
            <h1
              id="lesson-title"
              className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-5xl"
            >
              {LESSON.title}
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">{LESSON.overview}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">⏱ {LESSON.duration}</span>
              <span className="flex items-center gap-1 rounded-full bg-green-900/60 px-3 py-1 text-green-300">
                Beginner
              </span>
            </div>

            {/* Hero image placeholder */}
            <div className="mt-10">
              <Placeholder
                label="Hero Image — What Is Real Estate?"
                icon="🏘️"
                description="Illustration or photograph showing a mix of residential, commercial, and industrial real estate. Replace with final asset."
              />
            </div>
          </div>
        </section>

        {/* ── Body ────────────────────────────────────────────── */}
        <div className="mx-auto max-w-5xl px-6 py-16 space-y-16">
          {/* What You Will Learn */}
          <section aria-labelledby="what-you-will-learn">
            <SectionHeading>
              <span id="what-you-will-learn">What You Will Learn</span>
            </SectionHeading>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2" role="list">
              {LESSON.whatYouWillLearn.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-300"
                >
                  <span className="mt-0.5 text-yellow-400 flex-shrink-0" aria-hidden="true">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Video Player */}
          <section aria-labelledby="video-lesson">
            <SectionHeading>
              <span id="video-lesson">Watch the Lesson</span>
            </SectionHeading>
            <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title={LESSON.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </section>

          {/* What Is Real Estate? */}
          <section aria-labelledby="what-is-real-estate">
            <SectionHeading>
              <span id="what-is-real-estate">What Is Real Estate?</span>
            </SectionHeading>
            <div className="mt-6 space-y-6 text-slate-300 leading-relaxed">
              <p>
                Real estate is any land and anything permanently attached to it — buildings,
                structures, and natural resources on or beneath the surface. When you own real
                estate, you own a physical, tangible asset. Unlike{" "}
                <GlossaryTerm term="Paper Assets">paper assets</GlossaryTerm> such as stocks or
                bonds, real estate cannot be created infinitely. Land supply is finite.
              </p>
              <p>
                As an{" "}
                <GlossaryTerm term="Asset Class">asset class</GlossaryTerm>, real estate has three
                defining characteristics: it is tangible (you can see and touch it), it is local
                (values are driven by local supply, demand, and economic conditions), and it is{" "}
                <GlossaryTerm term="Illiquidity">illiquid</GlossaryTerm> (converting it to cash
                requires time, a willing buyer, and a completed transaction).
              </p>
              <p>
                Understanding these characteristics — including{" "}
                <GlossaryTerm term="Illiquidity">illiquidity</GlossaryTerm> — is essential before
                committing capital. Real estate rewards patient, informed investors and punishes
                those who need quick access to cash.
              </p>
            </div>
          </section>

          {/* Categories */}
          <section aria-labelledby="categories">
            <SectionHeading>
              <span id="categories">The Five Major Categories</span>
            </SectionHeading>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {LESSON.categories.map((cat) => (
                <Card key={cat.name}>
                  <h3 className="font-black text-yellow-400">{cat.name}</h3>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">{cat.description}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Wealth Mechanisms */}
          <section aria-labelledby="wealth-mechanisms">
            <SectionHeading>
              <span id="wealth-mechanisms">How Real Estate Builds Wealth</span>
            </SectionHeading>
            <p className="mt-3 text-slate-400">
              Real estate generates wealth through four distinct mechanisms. Understanding each one
              is essential before investing.
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <Card>
                <h3 className="text-lg font-black text-yellow-400">
                  <GlossaryTerm term="Cash Flow">Cash Flow</GlossaryTerm>
                </h3>
                <p className="mt-2 text-slate-300 leading-relaxed text-sm">
                  {LESSON.wealthMechanisms.cashFlow.description}
                </p>
              </Card>
              <Card>
                <h3 className="text-lg font-black text-yellow-400">
                  <GlossaryTerm term="Appreciation">Appreciation</GlossaryTerm>
                </h3>
                <p className="mt-2 text-slate-300 leading-relaxed text-sm">
                  {LESSON.wealthMechanisms.appreciation.description}
                </p>
              </Card>
              <Card>
                <h3 className="text-lg font-black text-yellow-400">
                  <GlossaryTerm term="Leverage">Leverage</GlossaryTerm>
                </h3>
                <p className="mt-2 text-slate-300 leading-relaxed text-sm">
                  {LESSON.wealthMechanisms.leverage.description}
                </p>
              </Card>
              <Card>
                <h3 className="text-lg font-black text-yellow-400">Tax Benefits</h3>
                <p className="mt-2 text-slate-300 leading-relaxed text-sm">
                  {LESSON.wealthMechanisms.taxBenefits.description}
                </p>
              </Card>
            </div>

            {/* Cash Flow vs. Appreciation infographic placeholder */}
            <div className="mt-8">
              <Placeholder
                label="Infographic — Cash Flow vs. Appreciation"
                icon="📊"
                description="Side-by-side comparison illustrating the difference between monthly cash flow income and long-term appreciation growth. Replace with final infographic asset."
              />
            </div>
          </section>

          {/* Advantages vs. Disadvantages */}
          <section aria-labelledby="advantages-disadvantages">
            <SectionHeading>
              <span id="advantages-disadvantages">Advantages and Disadvantages</span>
            </SectionHeading>

            {/* Placeholder for designed comparison table */}
            <div className="mt-6">
              <Placeholder
                label="Comparison Table — Advantages vs. Disadvantages"
                icon="⚖️"
                description="Formatted table comparing key benefits and limitations of real estate investing. Replace with final designed component."
              />
            </div>

            {/* Accessible fallback table (screen-reader friendly) */}
            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Advantages and Disadvantages of Real Estate Investing
                </caption>
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900">
                    <th
                      scope="col"
                      className="px-6 py-4 text-left font-black text-green-400 w-1/2"
                    >
                      ✅ Advantages
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left font-black text-red-400 w-1/2"
                    >
                      ⚠️ Disadvantages
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950">
                  <tr className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 text-slate-300">Cash flow from rental income</td>
                    <td className="px-6 py-4 text-slate-300">High capital requirements to start</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 text-slate-300"><GlossaryTerm term="Leverage">Leverage</GlossaryTerm> amplifies returns</td>
                    <td className="px-6 py-4 text-slate-300"><GlossaryTerm term="Illiquidity">Illiquid</GlossaryTerm> — difficult to convert quickly to cash</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 text-slate-300">Long-term appreciation potential</td>
                    <td className="px-6 py-4 text-slate-300">Management intensive, especially early on</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 text-slate-300">Significant tax advantages (depreciation, 1031)</td>
                    <td className="px-6 py-4 text-slate-300"><GlossaryTerm term="Leverage">Leverage</GlossaryTerm> amplifies losses as well as gains</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 text-slate-300">Hedge against inflation</td>
                    <td className="px-6 py-4 text-slate-300">Local market risk and vacancy exposure</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 text-slate-300"><GlossaryTerm term="REIT">REIT</GlossaryTerm> access without direct ownership</td>
                    <td className="px-6 py-4 text-slate-300">Maintenance, repairs, and unexpected capital expenditures</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Future Calculator Placeholder */}
          <section aria-labelledby="calculator">
            <SectionHeading>
              <span id="calculator">Real Estate Returns Calculator</span>
            </SectionHeading>
            <p className="mt-3 text-slate-400">
              Use this tool to model potential returns based on your purchase price, down payment,
              rental income, and estimated appreciation.
            </p>
            <div className="mt-6">
              <Placeholder
                label="Interactive Calculator — Real Estate Returns"
                icon="🧮"
                description="Future interactive calculator: inputs for purchase price, down payment, rental income, expenses, and appreciation rate. Outputs cash-on-cash return, cap rate, and 10-year projection. Replace with final component."
              />
            </div>
          </section>

          {/* Key Takeaways */}
          <section aria-labelledby="key-takeaways">
            <SectionHeading>
              <span id="key-takeaways">Key Takeaways</span>
            </SectionHeading>
            <Card className="mt-6">
              <ol className="space-y-4" role="list">
                {LESSON.keyTakeaways.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400 text-xs font-black text-black"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <p className="text-slate-300 leading-relaxed">{item}</p>
                  </li>
                ))}
              </ol>
            </Card>
          </section>

          {/* Common Mistakes */}
          <section aria-labelledby="common-mistakes">
            <SectionHeading>
              <span id="common-mistakes">Common Mistakes to Avoid</span>
            </SectionHeading>
            <div className="mt-6 space-y-4">
              {LESSON.commonMistakes.map((item) => (
                <details
                  key={item.mistake}
                  className="group rounded-2xl border border-slate-800 bg-slate-900"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-bold text-slate-100 hover:text-yellow-400 transition-colors">
                    <span>⚠️ {item.mistake}</span>
                    <span
                      className="flex-shrink-0 text-slate-500 group-open:rotate-180 transition-transform"
                      aria-hidden="true"
                    >
                      ▼
                    </span>
                  </summary>
                  <p className="border-t border-slate-800 px-6 py-5 text-slate-300 leading-relaxed">
                    {item.detail}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq">
            <SectionHeading>
              <span id="faq">Frequently Asked Questions</span>
            </SectionHeading>
            <div className="mt-6 space-y-3">
              {LESSON.faqs.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-slate-800 bg-slate-900"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-bold text-slate-100 hover:text-yellow-400 transition-colors">
                    <span>{item.question}</span>
                    <span
                      className="flex-shrink-0 text-slate-500 group-open:rotate-180 transition-transform"
                      aria-hidden="true"
                    >
                      ▼
                    </span>
                  </summary>
                  <p className="border-t border-slate-800 px-6 py-5 text-slate-300 leading-relaxed">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* Educational Disclaimer */}
          <section
            aria-labelledby="disclaimer"
            className="rounded-2xl border border-yellow-900/40 bg-yellow-950/20 p-6"
          >
            <h2
              id="disclaimer"
              className="text-lg font-black text-yellow-300"
            >
              Educational Disclaimer
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-yellow-100/70">
              {EDUNANCIAL_PUBLIC_DISCLAIMER}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-yellow-100/70">
              {EDUNANCIAL_METHODS_CLARIFICATION}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-yellow-100/70">
              Nothing in this lesson constitutes investment, legal, tax, accounting, or financial
              advice. Real estate investing involves risk, including the possible loss of principal.
              Always consult qualified professionals before making investment decisions.
            </p>
          </section>

          {/* Next Lesson */}
          <section aria-labelledby="next-lesson" className="border-t border-slate-800 pt-12">
            <p
              id="next-lesson"
              className="text-xs font-black uppercase tracking-widest text-yellow-400"
            >
              Up Next
            </p>
            <Link
              href={LESSON.nextLesson.href}
              className="mt-4 flex items-center justify-between gap-6 rounded-2xl border border-slate-700 bg-slate-900 px-6 py-6 hover:border-yellow-500 hover:bg-slate-800 transition group"
            >
              <div>
                <p className="text-xs text-slate-500">Lesson {LESSON.lessonNumber + 1} of {LESSON.totalLessons}</p>
                <p className="mt-1 text-xl font-black group-hover:text-yellow-400 transition-colors">
                  {LESSON.nextLesson.title}
                </p>
              </div>
              <span
                className="flex-shrink-0 text-2xl text-slate-500 group-hover:text-yellow-400 transition-colors"
                aria-hidden="true"
              >
                →
              </span>
            </Link>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href={`/courses/${LESSON.courseId}`}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-300 hover:bg-slate-800 transition"
              >
                ← Back to Course
              </Link>
              <Link
                href="/courses"
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-300 hover:bg-slate-800 transition"
              >
                Browse All Courses
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
