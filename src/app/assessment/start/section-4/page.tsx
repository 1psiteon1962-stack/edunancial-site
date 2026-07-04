import Link from "next/link";

export const metadata = {
  title: "Section 4 | Business",
  description:
    "Financial Competency Assessment - Business",
};

export default function AssessmentSectionFour() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-24">

        <p className="font-bold uppercase tracking-[0.45em] text-blue-500">

          SECTION 4 OF 6

        </p>

        <h1 className="mt-8 text-6xl font-black">

          Business Competency

        </h1>

        <p className="mt-8 max-w-4xl text-2xl leading-10 text-slate-300">

          This section measures your understanding of
          entrepreneurship,
          profitability,
          pricing,
          cash flow,
          leadership,
          marketing,
          and business growth.

        </p>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 1

          </h2>

          <p className="mt-8 text-2xl leading-10">

            Which statement best describes your current
            business experience?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              A. I currently own one or more businesses.

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              B. I previously owned a business.

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              C. I plan to start a business.

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              D. I have never owned a business.

            </button>

          </div>

        </div>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 2

          </h2>

          <p className="mt-8 text-2xl leading-10">

            Which financial measurement is most important
            when evaluating a business?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              A. Profit

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              B. Revenue

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              C. Number of employees

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              D. Size of the office

            </button>

          </div>

        </div>
