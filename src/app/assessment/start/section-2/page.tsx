import Link from "next/link";

export const metadata = {
  title: "Section 2 | Investing",
  description:
    "Financial Competency Assessment - Investing",
};

export default function AssessmentSectionTwo() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-24">

        <p className="font-bold uppercase tracking-[0.45em] text-white">

          SECTION 2 OF 6

        </p>

        <h1 className="mt-8 text-6xl font-black">

          Investing &
          <br />
          Paper Assets

        </h1>

        <p className="mt-8 max-w-4xl text-2xl leading-10 text-slate-300">

          This section evaluates your understanding of investing,
          diversification,
          stocks,
          ETFs,
          retirement planning,
          precious metals,
          and long-term wealth creation.

        </p>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 1

          </h2>

          <p className="mt-8 text-2xl leading-10">

            Which statement best describes your current investing experience?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-white">

              A. I actively manage multiple investments.

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-white">

              B. I invest regularly.

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-white">

              C. I have invested a little.

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-white">

              D. I have never invested.

            </button>

          </div>

        </div>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 2

          </h2>

          <p className="mt-8 text-2xl leading-10">

            How diversified is your investment portfolio?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-white">

              A. Highly diversified

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-white">

              B. Moderately diversified

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-white">

              C. Limited diversification

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-white">

              D. No investments

            </button>

          </div>

        </div>

               <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 3

          </h2>

          <p className="mt-8 text-2xl leading-10">

            Which investment best protects purchasing power over
            long periods of inflation?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-white">

              A. Diversified portfolio of productive assets

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-white">

              B. Savings account only

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-white">

              C. Cash kept at home

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-white">

              D. I don't know

            </button>

          </div>

        </div>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 4

          </h2>

          <p className="mt-8 text-2xl leading-10">

            Before purchasing an investment,
            how much research do you normally perform?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-white">

              A. Extensive research and comparison

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-white">

              B. Some research

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-white">

              C. Very little research

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-white">

              D. I usually rely on tips or emotion

            </button>

          </div>

        </div>

        <div className="mt-16 flex justify-between">

          <Link
            href="/assessment/start/section-1"
            className="rounded-xl border border-white px-8 py-4 text-lg font-bold hover:bg-white hover:text-black"
          >

            Previous

          </Link>

          <Link
            href="/assessment/start/section-3"
            className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700"
          >

            Continue to Section 3 →

          </Link>

        </div>

              </section>

    </main>

  );
}
