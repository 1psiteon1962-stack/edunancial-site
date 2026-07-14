import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mission & Vision | Edunancial",
  description:
    "Edunancial's mission is to teach people how to think — not what to think — so they can make better financial decisions for the rest of their lives.",
};

export default function MissionPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
          Mission &amp; Vision
        </p>
        <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight md:text-7xl">
          Teach people how to think — not what to think.
        </h1>
        <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-300">
          Edunancial exists to make practical financial literacy and financial competency
          accessible to working people, families, and entrepreneurs everywhere.
        </p>
      </section>

      {/* Mission */}
      <section className="border-y border-white/10 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.4em] text-blue-400">
                Our Mission
              </p>
              <h2 className="mt-6 text-4xl font-black md:text-5xl">
                Practical knowledge.<br />Real-world results.
              </h2>
              <div className="mt-8 space-y-5 text-lg leading-8 text-slate-300">
                <p>
                  To make practical financial literacy accessible worldwide while helping
                  individuals develop the knowledge and confidence to make better financial
                  and business decisions.
                </p>
                <p>
                  Edunancial is built for working people — families, professionals, beginning
                  investors, and entrepreneurs — who want to improve their financial future
                  one decision at a time.
                </p>
                <p>
                  Financial literacy provides knowledge. Financial competency is the ability
                  to consistently apply that knowledge in the real world. That difference
                  changes lives.
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.4em] text-green-400">
                Our Vision
              </p>
              <h2 className="mt-6 text-4xl font-black md:text-5xl">
                A world that thinks differently about money.
              </h2>
              <div className="mt-8 space-y-5 text-lg leading-8 text-slate-300">
                <p>
                  To build the world's leading financial competency platform — where structured
                  learning, guided practice, and thoughtful technology help people make better
                  decisions year after year.
                </p>
                <p>
                  We envision a future where financial education is not a one-time event
                  but a lifelong practice. Where families teach their children what they have
                  learned. Where the gap between financial vocabulary and financial action
                  closes — one person at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core principles */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">
          How We Think
        </p>
        <h2 className="mt-6 text-4xl font-black md:text-5xl">
          Five principles that guide everything we build.
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[
            {
              number: "01",
              title: "Teach HOW to think.",
              body: "We do not tell people what to do with their money. We teach frameworks, systems, and questions that lead to better independent decisions.",
            },
            {
              number: "02",
              title: "Literacy becomes competency through practice.",
              body: "Knowing a financial term is not the same as being able to apply it under real conditions. Competency is built through repetition, reflection, and guided action.",
            },
            {
              number: "03",
              title: "AI is a coach — not a decision maker.",
              body: "Our AI asks questions, encourages analysis, challenges assumptions, and recommends additional learning. It never tells members what to buy, sell, or invest in.",
            },
            {
              number: "04",
              title: "Independent thinking is the goal.",
              body: "Every lesson, exercise, and reflection is designed to strengthen your own judgment — not to create dependence on an advisor, algorithm, or opinion.",
            },
            {
              number: "05",
              title: "Change happens over time.",
              body: "One lesson will not change your financial life. Consistent practice over months and years will. We are here for the long commitment, not the quick result.",
            },
            {
              number: "06",
              title: "Learn. Think. Practice. Improve. Repeat.",
              body: "This is the Edunancial method. Plain language. Disciplined progression. Honest milestones. No exaggeration. No promises of quick wealth.",
            },
          ].map((item) => (
            <div
              key={item.number}
              className="rounded-2xl border border-white/10 bg-white/5 p-7"
            >
              <p className="text-3xl font-black text-yellow-400">{item.number}</p>
              <h3 className="mt-4 text-xl font-black">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-wrap gap-4">
            <Link
              href="/our-story"
              className="rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition hover:bg-blue-700"
            >
              Read Our Story
            </Link>
            <Link
              href="/courses"
              className="rounded-xl border border-white/20 px-8 py-4 font-bold transition hover:bg-white hover:text-slate-950"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
