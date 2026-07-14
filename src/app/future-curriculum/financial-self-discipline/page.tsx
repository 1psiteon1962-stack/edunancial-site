import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Financial Self-Discipline — Future Curriculum | Edunancial",
  description:
    "A future Edunancial curriculum on the discipline that underlies all wealth-building — under development.",
};

const levelProgression = [
  {
    level: "L1",
    title: "The Foundation",
    description: "Why discipline — not income — is the primary variable in long-term financial outcomes. The allowance model as a starting framework.",
  },
  {
    level: "L2",
    title: "First Steps",
    description: "Practical exercises in delayed gratification. The progression from first purchase to first physical asset (silver as a tangible lesson).",
  },
  {
    level: "L3",
    title: "Building Habits",
    description: "Consistency as a compounding force. How small, repeated disciplined decisions build momentum over years.",
  },
  {
    level: "L4",
    title: "Applying Discipline to Investing",
    description: "The transition from saving physical assets to investing in paper assets and business. Discipline applied to portfolio decisions.",
  },
  {
    level: "L5",
    title: "Systems of Discipline",
    description: "Building financial systems that enforce discipline automatically — so willpower is not the only mechanism.",
  },
];

const teachingProgression = [
  { step: "01", title: "Allowance", body: "Learning that money is earned, not given. The first real experience of choice and consequence with a small, personal budget." },
  { step: "02", title: "Purchase Silver", body: "Using saved money to buy a tangible asset for the first time. The tactile experience of owning something purchased with patience." },
  { step: "03", title: "Graduate to Gold", body: "Progressing to a higher-value asset — earning the right to buy gold by first demonstrating discipline with silver." },
  { step: "04", title: "Begin Investing", body: "Entering paper assets (stocks, ETFs) with the discipline already established. Understanding that investing is not gambling — it is disciplined capital allocation over time." },
  { step: "05", title: "Learn Business Ownership", body: "Applying all prior discipline to building and owning a business — the highest-leverage wealth-building vehicle." },
];

const reflectionQuestions = [
  "What is one area of your financial life where discipline has created a measurable improvement?",
  "What is one area where lack of discipline has cost you — in money, opportunity, or time?",
  "How do you define delayed gratification in your own words?",
  "What system or habit could you put in place today to make discipline easier tomorrow?",
  "If you were teaching a child your current financial habits, what would you change first?",
];

export default function FinancialSelfDisciplinePage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      {/* Under development banner */}
      <div className="border-b border-blue-400/20 bg-blue-400/10">
        <div className="mx-auto max-w-7xl px-6 py-3 text-center text-sm font-bold text-blue-300">
          Future Curriculum — Under Development — Not Yet Available
        </div>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/future-curriculum" className="hover:text-white">Future Curriculum</Link>
          <span>/</span>
          <span className="text-slate-200">Financial Self-Discipline</span>
        </nav>
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-blue-400">
          Future Curriculum
        </p>
        <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight md:text-6xl">
          Financial Self-Discipline
        </h1>
        <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-300">
          Discipline is not a personality trait. It is a practice. This curriculum
          covers the principles and habits of financial self-discipline — from the
          first lesson about allowances to long-term investing and business ownership.
        </p>
        <div className="mt-6 inline-block rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-1.5 text-sm font-bold text-blue-300">
          Availability date not yet scheduled
        </div>
      </section>

      {/* Teaching progression */}
      <section className="border-y border-white/10 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-3xl font-black md:text-4xl">
            The Teaching Progression
          </h2>
          <p className="mt-4 max-w-2xl text-slate-400 leading-7">
            Financial discipline is best taught through a deliberate progression — each step
            reinforcing the habits built in the previous one. This curriculum is inspired by
            a real teaching method used with a real student.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
            {teachingProgression.map((step) => (
              <div key={step.step} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-3xl font-black text-blue-400">{step.step}</p>
                <h3 className="mt-3 text-xl font-black">{step.title}</h3>
                <p className="mt-3 text-xs leading-6 text-slate-400">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key topics */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black md:text-4xl">
              Core Principles
            </h2>
            <ul className="mt-8 space-y-4">
              {[
                ["Delayed gratification", "The ability to wait for a larger reward instead of accepting a smaller immediate one is the most reliable predictor of long-term financial success."],
                ["Consistency", "A small disciplined action repeated daily over years produces outcomes that feel impossible to someone without that system."],
                ["Compounding", "Compounding is not just a mathematical concept — it applies to habits, knowledge, and skill. Discipline compounds."],
                ["Personal responsibility", "No financial system will save someone who refuses to take ownership of their decisions. Responsibility is the starting point, not an outcome."],
                ["Long-term thinking", "Most financial mistakes come from over-weighting the present. Training the mind to value future outcomes equally is a learnable skill."],
              ].map(([title, body]) => (
                <li key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{body}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Level progression */}
          <div>
            <h2 className="text-3xl font-black md:text-4xl">
              Planned Level Progression (L1–L5)
            </h2>
            <p className="mt-4 text-slate-400 text-sm">
              Levels will be released as content is completed and reviewed.
            </p>
            <div className="mt-8 space-y-4">
              {levelProgression.map((lvl) => (
                <div key={lvl.level} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 text-2xl font-black text-blue-400">{lvl.level}</span>
                    <div>
                      <h3 className="font-black">{lvl.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{lvl.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
          These questions preview the kind of reflection this curriculum is designed to produce.
          Consider them carefully before this course is available.
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
