import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Future Curriculum | Edunancial",
  description:
    "A preview of the curriculum Edunancial is building next — topics under active development for future release.",
};

const futureCourses = [
  {
    slug: "generational-wealth",
    title: "Generational Wealth",
    summary:
      "Build wealth that supports the next three generations while teaching each generation to continue the practice.",
    topics: ["Financial education across generations", "Trusts and estate basics", "Real estate as a family asset", "Paper assets and long-term compounding", "Business ownership and succession", "Responsible stewardship", "Avoiding entitlement"],
    color: "border-yellow-400/30 bg-yellow-400/5",
    label: "text-yellow-400",
  },
  {
    slug: "financial-self-discipline",
    title: "Financial Self-Discipline",
    summary:
      "Practical discipline as the foundation of all wealth. From your first purchase to long-term investing — discipline comes before strategy.",
    topics: ["Delayed gratification in practice", "Consistency and compounding", "The allowance-to-investment progression", "Personal responsibility over time", "Long-term thinking vs. short-term reaction"],
    color: "border-blue-400/30 bg-blue-400/5",
    label: "text-blue-400",
  },
  {
    slug: "teaching-children-about-money",
    title: "Teaching Children About Money",
    summary:
      "How to introduce financial concepts to children at different ages — building habits that compound for a lifetime.",
    topics: ["Age-appropriate money conversations", "Allowances and earning", "Saving vs. spending vs. giving", "First investment concepts for teens", "Family financial systems"],
    color: "border-green-400/30 bg-green-400/5",
    label: "text-green-400",
  },
  {
    slug: "decision-making",
    title: "Decision Making",
    summary:
      "Structured frameworks for making better financial and business decisions — especially under uncertainty.",
    topics: ["How to frame financial decisions", "Risk and reward analysis", "Avoiding emotional decisions", "Pre-mortem thinking", "Deciding with incomplete information"],
    color: "border-purple-400/30 bg-purple-400/5",
    label: "text-purple-400",
  },
  {
    slug: "delayed-gratification",
    title: "Delayed Gratification",
    summary:
      "The single habit that separates people who build wealth from those who do not. Discipline in the present creates options in the future.",
    topics: ["Why delay is leverage", "Compounding as a reward for patience", "Systems that reinforce delayed gratification", "Real-world exercises"],
    color: "border-orange-400/30 bg-orange-400/5",
    label: "text-orange-400",
  },
  {
    slug: "risk-management",
    title: "Risk Management",
    summary:
      "Every wealth-building decision involves risk. This curriculum teaches how to identify, measure, and manage risk across real estate, paper assets, and business.",
    topics: ["Types of financial risk", "Risk tolerance vs. risk capacity", "Diversification principles", "Downside protection strategies", "When to act and when to wait"],
    color: "border-red-400/30 bg-red-400/5",
    label: "text-red-400",
  },
  {
    slug: "systems-thinking",
    title: "Systems Thinking",
    summary:
      "Wealth is built and maintained through systems, not single decisions. Learn to see money, business, and financial life as interconnected systems.",
    topics: ["What is a financial system", "Cash flow systems", "Business operating systems", "Feedback loops in wealth-building", "Identifying system failures before they happen"],
    color: "border-teal-400/30 bg-teal-400/5",
    label: "text-teal-400",
  },
  {
    slug: "entrepreneurship",
    title: "Entrepreneurship",
    summary:
      "A foundational curriculum for people considering starting or already operating a small business — built around real decisions, not theory.",
    topics: ["Idea validation", "Pricing and profit", "Cash flow management", "Marketing fundamentals", "Hiring and leadership basics", "Scaling responsibly"],
    color: "border-indigo-400/30 bg-indigo-400/5",
    label: "text-indigo-400",
  },
  {
    slug: "business-ownership",
    title: "Business Ownership",
    summary:
      "The transition from operator to owner — how to build a business that runs without depending on you for every decision.",
    topics: ["Owner vs. operator mindset", "Building systems for scale", "KPI dashboards", "Delegation and leadership", "Exit strategies and business value"],
    color: "border-cyan-400/30 bg-cyan-400/5",
    label: "text-cyan-400",
  },
];

export default function FutureCurriculumPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
          Coming Soon
        </p>
        <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight md:text-7xl">
          Future Curriculum
        </h1>
        <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-300">
          The following topics are under active development for future release. These are
          placeholders — not available courses. Content will be published as each
          curriculum is completed and reviewed.
        </p>
        <div className="mt-4 inline-block rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-sm font-bold text-yellow-300">
          Under Development — Not Yet Available
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {futureCourses.map((course) => (
            <article
              key={course.slug}
              className={`rounded-2xl border p-7 ${course.color}`}
            >
              <p className={`text-xs font-black uppercase tracking-[0.35em] ${course.label}`}>
                Coming Soon
              </p>
              <h2 className="mt-4 text-2xl font-black">{course.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{course.summary}</p>
              <ul className="mt-5 space-y-1.5">
                {course.topics.map((topic) => (
                  <li key={topic} className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="h-1 w-1 flex-shrink-0 rounded-full bg-slate-500" />
                    {topic}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-slate-500 italic">
                Availability date not yet scheduled.
              </p>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link
            href="/courses"
            className="rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition hover:bg-blue-700"
          >
            Explore Available Courses
          </Link>
          <Link
            href="/register"
            className="rounded-xl border border-white/20 px-8 py-4 font-bold transition hover:bg-white hover:text-slate-950"
          >
            Become a Member
          </Link>
        </div>
      </section>

    </main>
  );
}
