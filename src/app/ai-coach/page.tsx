import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Financial Coach | Edunancial",
  description:
    "The Edunancial AI Coach asks questions, encourages analysis, and challenges assumptions — helping you think better, not deciding for you.",
};

const coachDoes = [
  {
    title: "Asks questions",
    body: "The AI coach asks you to think through decisions before acting. It guides reflection, not reaction.",
  },
  {
    title: "Encourages analysis",
    body: "Rather than giving a quick answer, the coach helps you examine assumptions and consider multiple perspectives.",
  },
  {
    title: "Challenges assumptions",
    body: "The coach surfaces blind spots and encourages you to stress-test your thinking before committing to a financial direction.",
  },
  {
    title: "Recommends additional learning",
    body: "When a knowledge gap appears, the coach points you toward relevant courses, lessons, and resources inside Edunancial.",
  },
  {
    title: "Encourages independent thinking",
    body: "The goal of every AI session is to make you more capable of deciding for yourself — not to create reliance on the AI.",
  },
  {
    title: "Supports competency progression",
    body: "The coach tracks where you are in your L1–L5 progression and recommends next steps aligned with your actual level.",
  },
];

const coachNeverDoes = [
  "Tell you what to buy or sell",
  "Recommend specific investments",
  "Make financial decisions on your behalf",
  "Provide personalized financial, investment, tax, or legal advice",
  "Replace a licensed financial advisor or planner",
];

const reflectionQuestions = [
  "Do you understand why this principle matters to your financial situation?",
  "Could you explain this concept clearly to someone else?",
  "What assumptions changed for you after this session?",
  "Are you ready to apply this in a real decision, or do you need to review it again?",
  "Would returning to this topic in a few weeks strengthen your understanding?",
];

export default function AICoachPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
          AI Financial Coach
        </p>
        <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight md:text-7xl">
          A coach that helps you think — not a system that decides for you.
        </h1>
        <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-300">
          The Edunancial AI Coach is designed around one principle: financial competency
          is built through independent thinking, not dependence on an algorithm. The coach
          asks questions, encourages analysis, and challenges your assumptions — so you
          make better decisions for the rest of your life.
        </p>
        <p className="mt-6 max-w-3xl rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5 text-sm leading-7 text-yellow-200">
          <strong>Important:</strong> The Edunancial AI Coach is an educational tool only.
          It does not provide financial, investment, tax, accounting, or legal advice. It
          never tells you what to buy, sell, or invest in. All financial decisions remain
          entirely your own. Consult a licensed professional before making significant
          financial decisions.
        </p>
      </section>

      {/* What the coach does */}
      <section className="border-y border-white/10 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-blue-400">
            What the AI Coach Does
          </p>
          <h2 className="mt-6 text-4xl font-black md:text-5xl">
            Built to strengthen your judgment.
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {coachDoes.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-7"
              >
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What the coach never does */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-red-400">
              What the AI Coach Never Does
            </p>
            <h2 className="mt-6 text-4xl font-black">
              Clear limits. By design.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              These limits are not technical limitations — they are design decisions. An AI
              that makes financial decisions for you does not build your competency. It
              replaces it.
            </p>
            <ul className="mt-8 space-y-3">
              {coachNeverDoes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-300">
                  <span className="mt-1 flex-shrink-0 rounded-full bg-red-900/60 p-1 text-red-400">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  <span className="text-sm leading-6">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Reflection questions */}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-green-400">
              Reflection Questions
            </p>
            <h2 className="mt-6 text-4xl font-black">
              Every session ends with reflection.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              After each AI coaching session or instructional module, the coach encourages
              you to pause and reflect before continuing. You may continue immediately or
              return to any topic at any time.
            </p>
            <ol className="mt-8 space-y-4">
              {reflectionQuestions.map((q, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex-shrink-0 rounded-full bg-white/10 px-2.5 py-0.5 text-sm font-black text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-7 text-slate-300">{q}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8 md:p-10">
            <h2 className="text-3xl font-black md:text-4xl">
              Ready to build real financial competency?
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">
              Become a member to access the AI coach, structured learning paths, progress
              tracking, and the full Edunancial curriculum.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-xl bg-yellow-400 px-8 py-4 font-black text-slate-950 transition hover:bg-yellow-300"
              >
                Become a Member
              </Link>
              <Link
                href="/courses"
                className="rounded-xl border border-white/20 px-8 py-4 font-bold transition hover:bg-white hover:text-slate-950"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
