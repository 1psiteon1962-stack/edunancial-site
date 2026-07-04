import Link from "next/link";

export const metadata = {
  title: "Section 1 | Personal Finance",
  description:
    "Financial Competency Assessment - Personal Finance",
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

          This section measures your understanding of budgeting,
          cash flow, debt management, savings, emergency planning,
          and financial decision making.

        </p>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 1

          </h2>

          <p className="mt-8 text-2xl leading-10">

            How often do you prepare and follow a written budget?

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

            If you lost your primary source of income today,
            how long could you pay your normal living expenses?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              A. More than one year

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

               <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 3

          </h2>

          <p className="mt-8 text-2xl leading-10">

            Which statement best describes your savings habits?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              A. I save automatically every payday.

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              B. I save regularly but not consistently.

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              C. I save only when money is left over.

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              D. I rarely save money.

            </button>

          </div>

        </div>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 4

          </h2>

          <p className="mt-8 text-2xl leading-10">

            When making a purchase,
            what usually influences your decision the most?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              A. My written financial plan and budget.

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              B. I compare value before buying.

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              C. I usually decide based on emotion.

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              D. I buy what I want without much planning.

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
            href="/assessment/start/section-2"
            className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700"
          >

            Continue to Section 2 →

          </Link>

        </div>

             </section>

    </main>

  );
} 
