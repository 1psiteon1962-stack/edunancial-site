import Link from "next/link";
import {
  COLOR_FRAMEWORK,
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_METHODS_CLARIFICATION,
  RED_WHITE_BLUE_FOUNDATION,
} from "@/lib/positioning";

export const metadata = {
  title: "Our Story | Edunancial",
  description:
    "Learn why Edunancial exists and how Red, White, and Blue became the foundation of the membership platform.",
};

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      {/* HERO */}

      <section className="mx-auto max-w-7xl px-6 py-24 text-center">

        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">

          OUR STORY

        </p>

        <h1 className="mt-8 text-7xl font-black">

          Why Edunancial Exists

        </h1>

        <p className="mx-auto mt-10 max-w-5xl text-2xl leading-10 text-slate-300">
          {EDUNANCIAL_IDENTITY}
        </p>
        <p className="mx-auto mt-6 max-w-5xl text-lg leading-9 text-slate-400">
          {EDUNANCIAL_METHODS_CLARIFICATION}
        </p>

      </section>

      {/* MY SON */}

      <section className="mx-auto max-w-6xl px-6 py-20">

        <h2 className="text-5xl font-black text-blue-400">

          It Started With My Son

        </h2>

        <p className="mt-10 text-xl leading-10 text-slate-300">

          When my son was eleven years old he told me he wanted to work with
          his mind instead of his back.

          That conversation changed everything.

        </p>

        <p className="mt-8 text-xl leading-10 text-slate-300">

          Rather than simply telling him how money worked,
          we began teaching him how wealth is actually created.

        </p>

        <p className="mt-8 text-xl leading-10 text-slate-300">

          He learned budgeting.

          He bought precious metals.

          He researched stocks.

          He developed business ideas.

          He learned about corporations,
          holding companies,
          return on investment,
          and long-term thinking.

        </p>

        <p className="mt-8 text-xl leading-10 text-slate-300">

          The objective was never memorization.

          The objective was competency.

        </p>

        <p className="mt-8 text-xl leading-10 text-slate-300">
          Edunancial was never built to operate as a school or academic institution. It was built
          as a membership platform that helps people strengthen practical financial judgment.
        </p>

      </section>

      {/* NTEGE */}

      <section className="bg-[#111827]">

        <div className="mx-auto max-w-6xl px-6 py-20">

          <h2 className="text-5xl font-black text-green-400">

            Then Came Ntege

          </h2>

          <p className="mt-10 text-xl leading-10 text-slate-300">

            Thousands of miles away,
            a young entrepreneur in Uganda faced a completely different set
            of challenges.

          </p>

          <p className="mt-8 text-xl leading-10 text-slate-300">

            Together we focused on costs,
            pricing,
            inventory,
            gross profit,
            cash flow,
            hiring,
            customer demand,
            and expansion.

          </p>

          <p className="mt-8 text-xl leading-10 text-slate-300">

            The goal was never simply to learn business vocabulary.

            The goal was making better business decisions every day.

          </p>

          <p className="mt-8 text-xl leading-10 text-slate-300">

            Knowledge became action.

            Action became competency.

            Competency created opportunity.

          </p>

            <p className="mt-8 text-xl leading-10 text-slate-300">
              Those experiences shaped the methods used inside Edunancial: structured learning
              resources, practical exercises, guided reflection, and technology-supported support.
            </p>

          </div>

      </section>

      {/* CONCLUSION */}

      <section className="mx-auto max-w-6xl px-6 py-24">

        <h2 className="text-5xl font-black">

          Different Countries.

          Same Principles.

        </h2>

        <p className="mt-10 text-2xl leading-10 text-slate-300">

          One story began with a father teaching his son.

        </p>

        <p className="mt-6 text-2xl leading-10 text-slate-300">

          Another began with a determined young entrepreneur in Uganda.

        </p>

        <p className="mt-6 text-2xl leading-10 text-slate-300">

          Different backgrounds.

          Different opportunities.

          Different economies.

        </p>

        <p className="mt-10 text-3xl font-bold text-blue-300">

          Financial literacy provided the foundation.

        </p>

        <p className="mt-4 text-3xl font-bold text-green-300">

          Financial competency changed the outcome.

        </p>

        <p className="mt-10 text-xl leading-9 text-slate-300">
          {RED_WHITE_BLUE_FOUNDATION}
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {COLOR_FRAMEWORK.map((pillar) => (
            <article key={pillar.color} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-slate-400">
                {pillar.color}
              </p>
              <h3 className="mt-3 text-2xl font-black">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{pillar.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap gap-6">

          <Link
            href="/assessment"
            className="rounded-xl bg-blue-600 px-8 py-5 text-xl font-bold hover:bg-blue-700"
          >
            Take the Assessment
          </Link>

          <Link
            href="/courses"
            className="rounded-xl border border-white px-8 py-5 text-xl font-bold hover:bg-white hover:text-black"
          >
            Start Learning
          </Link>

        </div>

      </section>

    </main>
  );
}
