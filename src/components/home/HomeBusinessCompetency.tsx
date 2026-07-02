import Link from "next/link";

export default function HomeCompetency() {
  return (
    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.4em] text-yellow-400">
          OUR MISSION
        </p>

        <h2 className="mt-6 text-6xl font-black">
          Financial Competency
        </h2>

        <p className="mt-8 max-w-5xl text-2xl leading-10 text-slate-300">
          Financial literacy provides the foundation.
        </p>

        <p className="mt-4 max-w-5xl text-2xl font-bold leading-10 text-white">
          Financial competency is built through disciplined action.
        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          <div className="rounded-xl bg-slate-900 p-8">
            <h3 className="text-2xl font-black text-red-500">
              Learn
            </h3>

            <p className="mt-5 text-slate-300">
              Build financial literacy through structured education.
            </p>
          </div>

          <div className="rounded-xl bg-slate-900 p-8">
            <h3 className="text-2xl font-black text-blue-400">
              Practice
            </h3>

            <p className="mt-5 text-slate-300">
              Complete real-world missions and simulations.
            </p>
          </div>

          <div className="rounded-xl bg-slate-900 p-8">
            <h3 className="text-2xl font-black text-green-400">
              Measure
            </h3>

            <p className="mt-5 text-slate-300">
              Track your competency with assessments and dashboards.
            </p>
          </div>

          <div className="rounded-xl bg-slate-900 p-8">
            <h3 className="text-2xl font-black text-yellow-400">
              Improve
            </h3>

            <p className="mt-5 text-slate-300">
              Continue building better financial and business decisions.
            </p>
          </div>

        </div>

        <div className="mt-16">

          <Link
            href="/assessment"
            className="rounded-xl bg-blue-600 px-8 py-5 text-xl font-bold hover:bg-blue-700"
          >
            Measure Your Competency
          </Link>

        </div>

      </div>

    </section>
  );
}
