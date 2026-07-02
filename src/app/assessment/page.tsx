import Link from "next/link";

export const metadata = {
  title: "Financial Competency Assessment | Edunancial",
  description:
    "Measure your current level of financial competency and receive a personalized learning roadmap.",
};

export default function AssessmentPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">

          EDUNANCIAL ASSESSMENT

        </p>

        <h1 className="mt-8 text-7xl font-black">

          Discover Your

          <br />

          Financial Competency

        </h1>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

          Financial literacy provides the foundation.

          Financial competency is built through disciplined action.

        </p>

        <p className="mt-8 max-w-5xl text-xl leading-9 text-slate-400">

          This assessment evaluates your current knowledge,
          decision-making ability,
          business maturity,
          investment awareness,
          and economic competency.

        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2">

          <Link
            href="/assessment/start"
            className="rounded-xl bg-blue-600 p-8 hover:bg-blue-700"
          >

            <h2 className="text-3xl font-black">

              Start Assessment

            </h2>

            <p className="mt-5 text-slate-200">

              Approximately 15 minutes.

            </p>

          </Link>

          <Link
            href="/passport"
            className="rounded-xl border border-white p-8 hover:bg-white hover:text-black"
          >

            <h2 className="text-3xl font-black">

              View Passport

            </h2>

            <p className="mt-5">

              Track your competency over time.

            </p>

          </Link>

        </div>

      </section>

    </main>

  );
}
