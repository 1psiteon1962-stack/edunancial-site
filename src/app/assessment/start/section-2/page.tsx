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

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          SECTION 2 OF 6

        </p>

        <h1 className="mt-8 text-6xl font-black">

          Investing

        </h1>

        <p className="mt-8 max-w-4xl text-2xl leading-10 text-slate-300">

          This section evaluates your understanding of
          investing,
          risk,
          diversification,
          long-term planning,
          and wealth creation.

        </p>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 1

          </h2>

          <p className="mt-8 text-2xl leading-10">

            Which investment strategy best describes
            your current approach?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              A. Long-term diversified investing

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              B. Occasionally invest when I have extra money

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              C. Mostly keep cash in savings

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              D. I currently do not invest

            </button>

          </div>

        </div>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 2

          </h2>

          <p className="mt-8 text-2xl leading-10">

            How familiar are you with ETFs,
            mutual funds,
            and index investing?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              A. Very knowledgeable

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              B. Somewhat knowledgeable

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              C. I've heard of them

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              D. I don't know what they are

            </button>

          </div>

                  <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 3

          </h2>

          <p className="mt-8 text-2xl leading-10">

            Which statement best describes your understanding
            of investment risk?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              A. I understand how risk and return work together.

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              B. I understand the basics but want to learn more.

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              C. I know very little about investment risk.

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              D. I have never invested.

            </button>

          </div>

        </div>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 4

          </h2>

          <p className="mt-8 text-2xl leading-10">

            Which investment objective most closely matches
            your current financial goals?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              A. Long-term wealth creation

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              B. Retirement planning

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              C. Short-term income

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-blue-500">

              D. I have not established investment goals.

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
        </div>
