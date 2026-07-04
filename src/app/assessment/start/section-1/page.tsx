import Link from "next/link";

export const metadata = {
  title: "Section 1 | Personal Financial Management",
  description:
    "Financial Competency Assessment - Section 1",
};

export default function AssessmentSectionOne() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-24">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          SECTION 1 OF 6

        </p>

        <h1 className="mt-8 text-6xl font-black">

          Personal Financial Management

        </h1>

        <p className="mt-8 max-w-4xl text-2xl leading-10 text-slate-300">

          This section measures your understanding of
          budgeting,
          saving,
          debt,
          credit,
          cash flow,
          and financial decision-making.

        </p>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 1

          </h2>

          <p className="mt-8 text-2xl leading-10">

            Do you currently follow a written monthly budget?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              A. Every month

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              B. Most months

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              C. Occasionally

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              D. Never

            </button>

          </div>

        </div>

                <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 2

          </h2>

          <p className="mt-8 text-2xl leading-10">

            Approximately what percentage of your monthly income
            do you consistently save or invest?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              A. More than 20%

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              B. 10%–20%

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              C. Less than 10%

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              D. I do not consistently save

            </button>

          </div>

        </div>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 3

          </h2>

          <p className="mt-8 text-2xl leading-10">

            If you unexpectedly lost your primary income today,
            how long could you maintain your current lifestyle
            without borrowing money?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              A. More than 12 months

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              B. Six to twelve months

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              C. One to six months

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              D. Less than one month

            </button>

          </div>

        </div>

        <div className="mt-16 flex justify-between">

          <Link
            href="/assessment/start"
            className="rounded-xl border border-white px-8 py-4 text-lg font-bold hover:bg-white hover:text-black"
          >

            Previous

          </Link>

          <Link
           
<div className="mt-12 space-y-6">
