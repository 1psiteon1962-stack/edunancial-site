import Link from "next/link";

export const metadata = {
  title: "Section 5 | Risk Management",
  description:
    "Financial Competency Assessment - Risk Management",
};

export default function AssessmentSectionFive() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-24">

        <p className="font-bold uppercase tracking-[0.45em] text-green-400">

          SECTION 5 OF 6

        </p>

        <h1 className="mt-8 text-6xl font-black">

          Risk Management

        </h1>

        <p className="mt-8 max-w-4xl text-2xl leading-10 text-slate-300">

          Wealth is not created simply by making money.

          It is preserved through intelligent risk management,
          planning,
          insurance,
          emergency preparation,
          diversification,
          and disciplined decision making.

        </p>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 1

          </h2>

          <p className="mt-8 text-2xl leading-10">

            Do you currently maintain an emergency fund?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-green-500">

              A. More than twelve months of expenses

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-green-500">

              B. Six to twelve months

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-green-500">

              C. Less than six months

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-green-500">

              D. No emergency fund

            </button>

          </div>

        </div>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 2

          </h2>

          <p className="mt-8 text-2xl leading-10">

            How would you describe your understanding
            of insurance and liability protection?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-green-500">

              A. Very knowledgeable

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-green-500">

              B. Moderate understanding

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-green-500">

              C. Limited understanding

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-green-500">

              D. Very little knowledge

            </button>

          </div>

        </div>
                <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 3

          </h2>

          <p className="mt-8 text-2xl leading-10">

            How diversified are your financial assets?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-green-500">

              A. Diversified across multiple asset classes

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-green-500">

              B. Some diversification

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-green-500">

              C. Very limited diversification

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-green-500">

              D. No investment diversification

            </button>

          </div>

        </div>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Question 4

          </h2>

          <p className="mt-8 text-2xl leading-10">

            Before making a major financial decision,
            what do you usually do?

          </p>

          <div className="mt-10 space-y-4">

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-green-500">

              A. Research thoroughly and evaluate alternatives

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-green-500">

              B. Seek advice from knowledgeable professionals

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-green-500">

              C. Make decisions primarily on instinct

            </button>

            <button className="w-full rounded-xl border border-slate-700 p-6 text-left hover:border-green-500">

              D. Often make quick decisions without much planning

            </button>

          </div>

        </div>

        <div className="mt-16 flex justify-between">

          <Link
            href="/assessment/start/section-4"
            className="rounded-xl border border-white px-8 py-4 text-lg font-bold hover:bg-white hover:text-black"
          >

            Previous

          </Link>

          <Link
            href="/assessment/start/section-6"
            className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700"
          >

            Continue to Section 6 →

          </Link>

        </div>

      </section>

    </main>

  );
}
