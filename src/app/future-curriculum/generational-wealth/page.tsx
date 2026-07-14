import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Generational Wealth — Future Curriculum | Edunancial",
  description:
    "A future Edunancial curriculum covering the principles of building wealth that supports the next three generations — under development.",
};

const levelProgression = [
  {
    level: "L1",
    title: "Foundations",
    description: "What generational wealth means, why most families lose wealth by the third generation, and what a deliberate generational plan looks like.",
  },
  {
    level: "L2",
    title: "The Tools",
    description: "Introduction to the primary vehicles: financial education, trusts, real estate, paper assets, and business ownership as generational assets.",
  },
  {
    level: "L3",
    title: "Building the Framework",
    description: "How to structure a generational wealth plan — timelines, ownership structures, legal basics, and responsible stewardship principles.",
  },
  {
    level: "L4",
    title: "Passing It On",
    description: "Teaching the next generation the principles behind the wealth — avoiding entitlement, building capacity, and preserving what was built.",
  },
  {
    level: "L5",
    title: "Long-Term Stewardship",
    description: "Advanced concepts: succession planning, family governance, and building systems that outlast any one generation.",
  },
];

const coreTopics = [
  "Financial education as the first asset",
  "How trusts protect and transfer wealth",
  "Real estate as a multigenerational asset",
  "Paper assets and long-term compounding",
  "Building a family business with succession in mind",
  "Responsible stewardship — the duty of each generation",
  "Avoiding entitlement: building capacity, not dependency",
  "The three-generation framework: founder → children → grandchildren",
];

const reflectionQuestions = [
  "What does generational wealth mean to your family specifically?",
  "What financial knowledge do you wish you had been taught earlier?",
  "What one habit, if taught consistently to your children, would change their financial future?",
  "How would you describe responsible stewardship to the next generation in plain language?",
  "What would need to be true for your grandchildren to be financially capable — not just financially comfortable?",
];

export default function GenerationalWealthPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      {/* Under development banner */}
      <div className="border-b border-yellow-400/20 bg-yellow-400/10">
        <div className="mx-auto max-w-7xl px-6 py-3 text-center text-sm font-bold text-yellow-300">
          Future Curriculum — Under Development — Not Yet Available
        </div>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/future-curriculum" className="hover:text-white">Future Curriculum</Link>
          <span>/</span>
          <span className="text-slate-200">Generational Wealth</span>
        </nav>
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
          Future Curriculum
        </p>
        <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight md:text-6xl">
          Generational Wealth
        </h1>
        <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-300">
          Build wealth that supports the next three generations — while teaching each
          generation to continue building for those that follow. This curriculum covers
          the principles, tools, and responsibilities of creating a lasting financial legacy.
        </p>
        <div className="mt-6 inline-block rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-sm font-bold text-yellow-300">
          Availability date not yet scheduled
        </div>
      </section>

      {/* Overview */}
      <section className="border-y border-white/10 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-black md:text-4xl">
                The Three-Generation Framework
              </h2>
              <div className="mt-8 space-y-5 text-lg leading-8 text-slate-300">
                <p>
                  Most families lose accumulated wealth within three generations. The pattern
                  is well-documented: the founding generation builds it, the second generation
                  maintains it, and the third generation exhausts it.
                </p>
                <p>
                  This curriculum is built around a different model — one where each generation
                  is educated, not simply provided for. Where wealth transfers alongside the
                  knowledge, discipline, and responsibility required to grow it further.
                </p>
                <p>
                  The goal is not to protect the next generation from financial difficulty.
                  The goal is to prepare them for financial opportunity.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-black md:text-4xl">
                Core Topics
              </h2>
              <ul className="mt-8 space-y-3">
                {coreTopics.map((topic) => (
                  <li key={topic} className="flex items-start gap-3 text-slate-300">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-400" />
                    <span className="text-base leading-7">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Level progression */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-3xl font-black md:text-4xl">
          Planned Level Progression (L1–L5)
        </h2>
        <p className="mt-4 text-slate-400">
          This progression is planned. Levels will be released as content is completed and reviewed.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {levelProgression.map((lvl) => (
            <div
              key={lvl.level}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-2xl font-black text-yellow-400">{lvl.level}</p>
              <h3 className="mt-2 text-lg font-black">{lvl.title}</h3>
              <p className="mt-3 text-xs leading-6 text-slate-400">{lvl.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Instructor */}
      <section className="border-y border-white/10 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-slate-400">Instructor</p>
          <p className="mt-3 text-xl font-black">To Be Announced</p>
          <p className="mt-2 text-sm text-slate-500">
            Instructor details will be published when this curriculum enters active development.
            All course content is developed by the Edunancial Team.
          </p>
        </div>
      </section>

      {/* Reflection questions */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-3xl font-black md:text-4xl">
          Reflection Questions
        </h2>
        <p className="mt-4 text-slate-400 max-w-2xl">
          These questions are included to encourage thinking about generational wealth before
          the curriculum is available. Consider them a preview of the kind of reflection this
          course is designed to produce.
        </p>
        <ol className="mt-10 space-y-5">
          {reflectionQuestions.map((q, i) => (
            <li key={i} className="flex items-start gap-5">
              <span className="flex-shrink-0 rounded-full bg-white/10 px-3 py-1 text-sm font-black text-white">
                {i + 1}
              </span>
              <span className="text-lg leading-8 text-slate-300">{q}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-wrap gap-4">
            <Link
              href="/future-curriculum"
              className="rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition hover:bg-blue-700"
            >
              View All Future Curriculum
            </Link>
            <Link
              href="/courses"
              className="rounded-xl border border-white/20 px-8 py-4 font-bold transition hover:bg-white hover:text-slate-950"
            >
              Explore Available Courses
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
