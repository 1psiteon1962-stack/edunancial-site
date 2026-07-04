import Link from "next/link";

export const metadata = {
  title: "Section 6 | Financial Competency Profile",
  description:
    "Financial Competency Assessment - Final Section",
};

export default function AssessmentSectionSix() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-24">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          SECTION 6 OF 6

        </p>

        <h1 className="mt-8 text-6xl font-black">

          Financial Competency Profile

        </h1>

        <p className="mt-8 max-w-4xl text-2xl leading-10 text-slate-300">

          This final section helps us understand your financial goals,
          motivation, learning preferences, and long-term objectives.
          Your answers allow Edunancial to build a personalized
          Financial Competency Roadmap.

        </p>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 1

          </h2>

          <p className="mt-8 text-2xl leading-10">

            What is your primary financial goal over the next
            five years?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-yellow-500">

              A. Financial Independence

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-yellow-500">

              B. Build a successful business

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-yellow-500">

              C. Become an active investor

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-yellow-500">

              D. Improve my financial knowledge

            </button>

          </div>

        </div>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 2

          </h2>

          <p className="mt-8 text-2xl leading-10">

            Which statement best describes you today?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-yellow-500">

              A. I actively build wealth every month.

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-yellow-500">

              B. I'm making progress but need better structure.

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-yellow-500">

              C. I'm just getting started.

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-yellow-500">

              D. I don't currently have a financial plan.

            </button>

          </div>

        </div>

                <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 3

          </h2>

          <p className="mt-8 text-2xl leading-10">

            How do you learn new financial concepts most effectively?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-yellow-500">

              A. Reading books and articles

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-yellow-500">

              B. Watching videos and demonstrations

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-yellow-500">

              C. Hands-on practice and real-world application

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-yellow-500">

              D. One-on-one coaching or mentoring

            </button>

          </div>

        </div>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 4

          </h2>

          <p className="mt-8 text-2xl leading-10">

            If you could master one financial skill next,
            which would have the greatest impact on your future?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-yellow-500">

              A. Building profitable businesses

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-yellow-500">

              B. Real estate investing

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-yellow-500">

              C. Investing in stocks, ETFs, and precious metals

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-yellow-500">

              D. Personal financial planning and budgeting

            </button>

          </div>

        </div>

        <div className="mt-16 rounded-2xl border border-yellow-500 bg-[#111827] p-10">

          <h2 className="text-4xl font-black">

            You're Almost Finished

          </h2>

          <p className="mt-8 text-xl leading-9 text-slate-300">

            Thank you for completing the Financial Competency Assessment.

            Your responses will now be evaluated to calculate your
            Financial Competency Score, identify your strongest
            competencies, determine opportunities for improvement,
            and build a personalized learning roadmap.

          </p>

        </div>

        <div className="mt-16 flex justify-between">

          <Link
            href="/assessment/start/section-5"
            className="rounded-xl border border-white px-8 py-4 text-lg font-bold hover:bg-white hover:text-black"
          >

            Previous

          </Link>

          <Link
            href="/assessment/results"
            className="rounded-xl bg-green-600 px-8 py-4 text-lg font-bold hover:bg-green-700"
          >

            View Results →

          </Link>

        </div>

             </section>

    </main>

  );
} 
