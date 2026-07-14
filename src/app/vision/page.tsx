import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Vision | Edunancial",
  description:
    "Edunancial's vision is a world where practical financial competency is accessible to everyone — one decision at a time.",
};

export default function VisionPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
          Our Vision
        </p>
        <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight md:text-7xl">
          A world that thinks differently about money.
        </h1>
        <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-300">
          To build the world's leading financial competency platform — where structured
          learning, guided practice, and thoughtful technology help people make better
          financial decisions year after year.
        </p>
      </section>

      <section className="border-y border-white/10 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-4xl font-black md:text-5xl">
                Financial education as a lifelong practice.
              </h2>
              <div className="mt-8 space-y-5 text-lg leading-8 text-slate-300">
                <p>
                  We envision a future where financial education is not a one-time event
                  but a consistent, evolving practice — built into the rhythm of daily life.
                </p>
                <p>
                  Where families teach their children what they have learned. Where the gap
                  between financial vocabulary and real financial action closes — one person,
                  one family, one decision at a time.
                </p>
                <p>
                  Where entrepreneurs in Uganda, working families in the United States, and
                  beginning investors across every continent have access to the same
                  structured, honest, practical financial education.
                </p>
              </div>
            </div>
            <div className="grid gap-5 self-start">
              {[
                ["Accessible", "Clear, structured financial education for L1 beginners through L5 advanced learners — no prior experience required."],
                ["Practical", "Every lesson leads to a decision or action. Learning without application is just memorization."],
                ["Global", "Built for working people in North America and expanding worldwide — same principles, local context."],
                ["Honest", "No exaggerated promises. No guaranteed outcomes. Plain language. Disciplined progress. Real results over time."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="text-xl font-black">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-wrap gap-4">
          <Link
            href="/mission"
            className="rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition hover:bg-blue-700"
          >
            Our Mission
          </Link>
          <Link
            href="/our-story"
            className="rounded-xl border border-white/20 px-8 py-4 font-bold transition hover:bg-white hover:text-slate-950"
          >
            Read Our Story
          </Link>
        </div>
      </section>

    </main>
  );
}
