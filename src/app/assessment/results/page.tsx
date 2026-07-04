import Link from "next/link";

export const metadata = {
  title: "Assessment Results | Edunancial",
  description:
    "Your Financial Competency Assessment Results",
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

          This report identifies your current strengths,
          opportunities for improvement,
          and recommended learning path.

        </p>

        <div className="mt-20 rounded-2xl bg-gradient-to-r from-blue-700 to-green-700 p-12 text-center">

          <p className="text-xl uppercase tracking-[0.4em]">

            OVERALL SCORE

          </p>

          <h2 className="mt-6 text-8xl font-black">

            82

          </h2>

          <p className="mt-6 text-3xl font-bold">

            Financial Competency Level:
            Advanced

          </p>

        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2">

          <div className="rounded-xl bg-red-700 p-10">

            <h3 className="text-3xl font-black">

              RED

            </h3>

            <p className="mt-6 text-xl">

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

            <p className="mt-6 text-xl">

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

            <p className="mt-6 text-xl">

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

            <p className="mt-6 text-xl">

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

              Your Strengths

            </h2>

            <ul className="mt-8 space-y-5 text-xl text-slate-300">

              <li>✓ Strong understanding of business fundamentals</li>

              <li>✓ Above-average investment knowledge</li>

              <li>✓ Good long-term financial planning</li>

              <li>✓ Positive financial habits</li>

            </ul>

          </div>

          <div className="rounded-2xl bg-slate-900 p-10">

            <h2 className="text-4xl font-black">

              Opportunities For Improvement

            </h2>

            <ul className="mt-8 space-y-5 text-xl text-slate-300">

              <li>• Improve real estate competency</li>

              <li>• Expand risk management knowledge</li>

              <li>• Increase emergency planning</li>

              <li>• Continue building diversified investments</li>

            </ul>

          </div>

        </div>

        <div className="mt-20 rounded-2xl bg-[#111827] p-10">

          <h2 className="text-4xl font-black">

            Recommended Learning Roadmap

          </h2>

          <div className="mt-10 space-y-8">

         <div className="rounded-xl bg-slate-900 p-8">   
