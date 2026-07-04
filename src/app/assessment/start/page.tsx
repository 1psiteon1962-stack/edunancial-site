import Link from "next/link";

export const metadata = {
  title: "Start Assessment | Edunancial",
  description:
    "Begin your Financial Competency Assessment.",
};

export default function AssessmentStartPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-24">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          STEP 1 OF 6

        </p>

        <h1 className="mt-8 text-6xl font-black">

          Financial Competency Assessment

        </h1>

        <p className="mt-10 max-w-4xl text-2xl leading-10 text-slate-300">

          Answer every question honestly.

          This assessment is designed to identify your strengths,
          weaknesses,
          and opportunities for growth.

        </p>

        <div className="mt-16 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-3xl font-black">

            Assessment Overview

          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">

            <div className="rounded-xl bg-slate-800 p-6">

              <h3 className="text-2xl font-bold">

                Personal Finance

              </h3>

              <p className="mt-4 text-slate-300">

                Budgeting, credit, debt, savings and cash flow.

              </p>

            </div>

            <div className="rounded-xl bg-slate-800 p-6">

              <h3 className="text-2xl font-bold">

                Investing

              </h3>

              <p className="mt-4 text-slate-300">

                Stocks, ETFs, precious metals and long-term investing.

              </p>

            </div>

            <div className="rounded-xl bg-slate-800 p-6">

              <h3 className="text-2xl font-bold">

                Real Estate

              </h3>

              <p className="mt-4 text-slate-300">

                Residential, commercial, financing and investing.

              </p>

            </div>

            <div className="rounded-xl bg-slate-800 p-6">

              <h3 className="text-2xl font-bold">

                Business

              </h3>

              <p className="mt-4 text-slate-300">

                Profit, KPIs, pricing, cash flow and leadership.

              </p>

            </div>

          </div>

        </div>
