import Link from "next/link";

export const metadata = {
  title: "Assessment Results | Edunancial",
  description:
    "Your personalized Financial Competency Assessment results.",
};

export default function AssessmentResultsPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="font-bold uppercase tracking-[0.45em] text-green-400">

          ASSESSMENT RESULTS

        </p>

        <h1 className="mt-8 text-7xl font-black">

          Your Financial
          <br />
          Competency Report

        </h1>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

          Congratulations on completing your assessment.

          Your Financial Competency Report identifies
          your strengths,
          your opportunities for improvement,
          and recommends the most effective learning
          path based upon your current competency level.

        </p>

        <div className="mt-20 rounded-2xl bg-gradient-to-r from-blue-700 via-green-600 to-blue-700 p-12 text-center">

          <p className="text-xl font-bold uppercase tracking-[0.4em]">

            OVERALL FINANCIAL COMPETENCY SCORE

          </p>

          <h2 className="mt-8 text-8xl font-black">

            82

          </h2>

          <p className="mt-8 text-3xl font-bold">

            Advanced Financial Competency

          </p>

        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl bg-red-700 p-10">

            <h3 className="text-3xl font-black">

              RED

            </h3>

            <p className="mt-5 text-xl">

              Real Estate

            </p>

            <p className="mt-8 text-5xl font-black">

              76%

            </p>

          </div>

          <div className="rounded-xl bg-white p-10 text-slate-900">

            <h3 className="text-3xl font-black">

              WHITE

            </h3>

            <p className="mt-5 text-xl">

              Paper Assets

            </p>

            <p className="mt-8 text-5xl font-black">

              84%

            </p>

          </div>

          <div className="rounded-xl bg-blue-700 p-10">

            <h3 className="text-3xl font-black">

              BLUE

            </h3>

            <p className="mt-5 text-xl">

              Business

            </p>

            <p className="mt-8 text-5xl font-black">

              91%

            </p>

          </div>

          <div className="rounded-xl bg-green-700 p-10">

            <h3 className="text-3xl font-black">

              RISK

            </h3>

            <p className="mt-5 text-xl">

              Risk Management

            </p>

            <p className="mt-8 text-5xl font-black">

              79%

            </p>

          </div>

        </div>

                <div className="mt-20 grid gap-8 lg:grid-cols-2">

          <div className="rounded-2xl bg-slate-900 p-10">

            <h2 className="text-4xl font-black">

              Your Greatest Strengths

            </h2>

            <ul className="mt-10 space-y-5 text-xl text-slate-300">

              <li>✓ Strong business decision-making ability</li>

              <li>✓ Good understanding of investing fundamentals</li>

              <li>✓ Consistent long-term financial thinking</li>

              <li>✓ Healthy financial habits</li>

            </ul>

          </div>

          <div className="rounded-2xl bg-slate-900 p-10">

            <h2 className="text-4xl font-black">

              Greatest Opportunities

            </h2>

            <ul className="mt-10 space-y-5 text-xl text-slate-300">

              <li>• Improve real estate knowledge</li>

              <li>• Expand risk management planning</li>

              <li>• Increase asset diversification</li>

              <li>• Continue improving financial systems</li>

            </ul>

          </div>

        </div>

        <div className="mt-20 rounded-2xl bg-[#111827] p-10">

          <h2 className="text-4xl font-black">

            Personalized Learning Roadmap

          </h2>

          <p className="mt-8 text-xl leading-9 text-slate-300">

            Based upon your assessment, Edunancial recommends
            concentrating first on your lowest competency areas
            while continuing to strengthen your existing skills.

          </p>

          <div className="mt-12 space-y-8">

            <div className="rounded-xl bg-slate-900 p-8">

              <h3 className="text-2xl font-black">

                Priority One

              </h3>

              <p className="mt-4 text-slate-300">

                Building Wealth Through Real Estate

              </p>

            </div>

            <div className="rounded-xl bg-slate-900 p-8">

              <h3 className="text-2xl font-black">

                Priority Two

              </h3>

              <p className="mt-4 text-slate-300">

                Risk Management and Asset Protection

              </p>

            </div>

            <div className="rounded-xl bg-slate-900 p-8">

              <h3 className="text-2xl font-black">

                Priority Three

              </h3>

              <p className="mt-4 text-slate-300">

                Executive KPI Dashboard and Business Analytics

              </p>

            </div>

          </div>

        </div>

               <div className="mt-20 rounded-2xl border border-blue-600 bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Recommended Next Courses

          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">

            <div className="rounded-xl border border-slate-700 p-6">

              <h3 className="text-2xl font-bold">

                Personal Financial Management

              </h3>

              <p className="mt-4 text-slate-300">

                Continue strengthening budgeting,
                cash flow,
                savings,
                and financial planning.

              </p>

            </div>

            <div className="rounded-xl border border-slate-700 p-6">

              <h3 className="text-2xl font-bold">

                Building Wealth Through Real Estate

              </h3>

              <p className="mt-4 text-slate-300">

                Develop competency in residential,
                commercial,
                creative financing,
                tax liens,
                and 1031 exchanges.

              </p>

            </div>

            <div className="rounded-xl border border-slate-700 p-6">

              <h3 className="text-2xl font-bold">

                Investing Fundamentals

              </h3>

              <p className="mt-4 text-slate-300">

                Learn portfolio construction,
                ETFs,
                stocks,
                options,
                and precious metals.

              </p>

            </div>

            <div className="rounded-xl border border-slate-700 p-6">

              <h3 className="text-2xl font-bold">

                Executive Business KPIs

              </h3>

              <p className="mt-4 text-slate-300">

                Improve pricing,
                profitability,
                dashboards,
                forecasting,
                and business scaling.

              </p>

            </div>

          </div>

        </div>

        <div className="mt-20 rounded-2xl bg-gradient-to-r from-green-700 to-blue-700 p-12 text-center">

          <h2 className="text-5xl font-black">

            Keep Building Financial Competency

          </h2>

          <p className="mx-auto mt-8 max-w-4xl text-2xl leading-10">

            Financial literacy introduces concepts.

            Financial competency develops the judgment,
            discipline,
            habits,
            and experience necessary to build wealth over a lifetime.

          </p>

        </div>

        <div className="mt-20 flex flex-wrap justify-center gap-6">

          <Link
            href="/courses"
            className="rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
          >

            Begin Learning

          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-white px-10 py-5 text-xl font-bold hover:bg-white hover:text-black"
          >

            Open Dashboard

          </Link>

          <Link
            href="/passport"
            className="rounded-xl border border-green-500 px-10 py-5 text-xl font-bold hover:bg-green-600"
          >

            View Passport

          </Link>

        </div>

             </section>

    </main>

  );
} 
