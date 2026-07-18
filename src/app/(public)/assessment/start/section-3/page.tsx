import Link from "next/link";

export const metadata = {
  title: "Section 3 | Real Estate",
  description:
    "Financial Competency Assessment - Real Estate",
};

export default function AssessmentSectionThree() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-24">

        <p className="font-bold uppercase tracking-[0.45em] text-red-500">

          SECTION 3 OF 6

        </p>

        <h1 className="mt-8 text-6xl font-black">

          Real Estate Competency

        </h1>

        <p className="mt-8 max-w-4xl text-2xl leading-10 text-slate-300">

          This section evaluates your understanding of
          real estate,
          financing,
          leverage,
          cash flow,
          appreciation,
          and wealth creation through property ownership.

        </p>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 1

          </h2>

          <p className="mt-8 text-2xl leading-10">

            Have you ever purchased real estate?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-red-500">

              A. Multiple investment properties

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-red-500">

              B. My primary residence

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-red-500">

              C. Currently researching

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-red-500">

              D. Never purchased property

            </button>

          </div>

        </div>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 2

          </h2>

          <p className="mt-8 text-2xl leading-10">

            Which financing methods are you familiar with?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-red-500">

              A. Conventional, FHA, VA and creative financing

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-red-500">

              B. Conventional mortgages only

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-red-500">

              C. Very limited knowledge

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-red-500">

              D. No experience

            </button>

          </div>


          
        </div>

                <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 3

          </h2>

          <p className="mt-8 text-2xl leading-10">

            What is the primary reason people invest in
            income-producing real estate?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-red-500">

              A. Cash flow, appreciation, tax advantages and leverage

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-red-500">

              B. Appreciation only

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-red-500">

              C. Because property values always increase

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-red-500">

              D. I don't know

            </button>

          </div>

        </div>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 4

          </h2>

          <p className="mt-8 text-2xl leading-10">

            Which statement best describes your current
            real estate investing goals?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-red-500">

              A. Actively acquiring investment properties

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-red-500">

              B. Planning to purchase within two years

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-red-500">

              C. Interested but uncertain where to begin

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-red-500">

              D. No current plans

            </button>

          </div>

        </div>

        <div className="mt-16 flex justify-between">

          <Link
            href="/assessment/start/section-2"
            className="rounded-xl border border-white px-8 py-4 text-lg font-bold hover:bg-white hover:text-black"
          >

            Previous

          </Link>

          <Link
            href="/assessment/start/section-4"
            className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700"
          >

            Continue to Section 4 →

          </Link>

        </div>

      </section>

    </main>

  );
}
