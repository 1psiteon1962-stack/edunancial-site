import Link from "next/link";

import { familyDashboardStats, householdGoals } from "@/data/familyPlatform";

export const metadata = {
  title: "Financial Competency Dashboard | Edunancial",
  description:
    "Track your Financial Competency journey.",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          MEMBER DASHBOARD

        </p>

        <h1 className="mt-8 text-7xl font-black">

          Financial Competency Dashboard

        </h1>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

          Monitor your progress.

          Complete courses.

          Improve your Financial Competency Score.

          Build wealth through continuous learning.

        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          <div className="rounded-2xl bg-blue-700 p-10 text-center">

            <p className="text-lg uppercase">

              Overall Score

            </p>

            <h2 className="mt-6 text-6xl font-black">

              82

            </h2>

          </div>

          <div className="rounded-2xl bg-red-700 p-10 text-center">

            <p className="text-lg uppercase">

              Courses Completed

            </p>

            <h2 className="mt-6 text-6xl font-black">

              14

            </h2>

          </div>

          <div className="rounded-2xl bg-green-700 p-10 text-center">

            <p className="text-lg uppercase">

              Learning Hours

            </p>

            <h2 className="mt-6 text-6xl font-black">

              39

            </h2>

          </div>

          <div className="rounded-2xl bg-yellow-600 p-10 text-center">

            <p className="text-lg uppercase">

              Certificates

            </p>

            <h2 className="mt-6 text-6xl font-black">

              6

            </h2>

          </div>

        </div>

        <div className="mt-20 rounded-2xl bg-slate-900 p-10">

          <h2 className="text-4xl font-black">

            Financial Competency Progress

          </h2>

          <div className="mt-10 space-y-8">

            <div>

              <div className="flex justify-between">

                <span>Personal Finance</span>

                <span>91%</span>

              </div>

              <div className="mt-3 h-4 rounded-full bg-slate-700">

                <div className="h-4 w-[91%] rounded-full bg-green-500"></div>

              </div>

            </div>

            <div>

              <div className="flex justify-between">

                <span>Real Estate</span>

                <span>76%</span>

              </div>

              <div className="mt-3 h-4 rounded-full bg-slate-700">

                <div className="h-4 w-[76%] rounded-full bg-red-500"></div>

              </div>

            </div>

            <div>

              <div className="flex justify-between">

                <span>Paper Assets</span>

                <span>84%</span>

              </div>

              <div className="mt-3 h-4 rounded-full bg-slate-700">

                <div className="h-4 w-[84%] rounded-full bg-white"></div>

              </div>

            </div>

            <div>

              <div className="flex justify-between">

                <span>Business</span>

                <span>95%</span>

              </div>

              <div className="mt-3 h-4 rounded-full bg-slate-700">

                <div className="h-4 w-[95%] rounded-full bg-blue-500"></div>

              </div>

            </div>

          </div>

        </div>

              <div className="mt-20 grid gap-8 lg:grid-cols-2">

          <div className="rounded-2xl bg-slate-900 p-10">

            <h2 className="text-4xl font-black">

              Recommended Next Courses

            </h2>

            <div className="mt-10 space-y-6">

              <div className="rounded-xl bg-slate-800 p-6">

                <h3 className="text-2xl font-bold">

                  Building Wealth Through Real Estate

                </h3>

                <p className="mt-4 text-slate-300">

                  Recommended because your Real Estate competency
                  score is currently below your overall average.

                </p>

              </div>

              <div className="rounded-xl bg-slate-800 p-6">

                <h3 className="text-2xl font-bold">

                  Advanced Risk Management

                </h3>

                <p className="mt-4 text-slate-300">

                  Improve wealth preservation and long-term
                  financial security.

                </p>

              </div>

              <div className="rounded-xl bg-slate-800 p-6">

                <h3 className="text-2xl font-bold">

                  Executive KPI Dashboard

                </h3>

                <p className="mt-4 text-slate-300">

                  Strengthen business decision-making using
                  measurable performance indicators.

                </p>

              </div>

            </div>

          </div>

          <div className="rounded-2xl bg-slate-900 p-10">

            <h2 className="text-4xl font-black">

              Achievement Badges

            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2">

              <div className="rounded-xl border border-yellow-500 p-6 text-center">

                🥇

                <p className="mt-4 font-bold">

                  First Assessment

                </p>

              </div>

              <div className="rounded-xl border border-blue-500 p-6 text-center">

                📈

                <p className="mt-4 font-bold">

                  Investment Explorer

                </p>

              </div>

              <div className="rounded-xl border border-red-500 p-6 text-center">

                🏘️

                <p className="mt-4 font-bold">

                  Real Estate Student

                </p>

              </div>

              <div className="rounded-xl border border-green-500 p-6 text-center">

                💼

                <p className="mt-4 font-bold">

                  Business Builder

                </p>

              </div>

            </div>

          </div>

        </div>

        <div className="mt-20 flex flex-wrap gap-6">

          <Link
            href="/courses"
            className="rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
          >

            Continue Learning

          </Link>

          <Link
            href="/assessment"
            className="rounded-xl border border-white px-10 py-5 text-xl font-bold hover:bg-white hover:text-black"
          >

            Retake Assessment

          </Link>

          <Link
            href="/marketplace"
            className="rounded-xl border border-green-500 px-10 py-5 text-xl font-bold hover:bg-green-600"
          >

            Visit Marketplace

          </Link>

        </div>

        <div className="mt-20 rounded-2xl bg-slate-900 p-10">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="font-bold uppercase tracking-[0.35em] text-green-300">

                Family learning platform

              </p>

              <h2 className="mt-4 text-4xl font-black">

                Extend your learning into the household dashboard

              </h2>

            </div>

            <p className="max-w-3xl text-slate-300">

              Connect parent oversight, child progress, household goals,
              and family achievements without losing your individual
              dashboard experience.

            </p>

          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {familyDashboardStats.map((stat) => (

              <div
                key={stat.label}
                className="rounded-xl border border-slate-700 bg-slate-950/70 p-6"
              >

                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">

                  {stat.label}

                </p>

                <h3 className="mt-4 text-3xl font-black">

                  {stat.value}

                </h3>

              </div>

            ))}

          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">

            {householdGoals.map((goal) => (

              <div
                key={goal.id}
                className="rounded-xl border border-slate-700 bg-slate-950/70 p-6"
              >

                <div className="flex items-start justify-between gap-4">

                  <h3 className="text-xl font-bold">

                    {goal.title}

                  </h3>

                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-200">

                    {goal.progress}%

                  </span>

                </div>

                <p className="mt-4 text-slate-300">

                  {goal.target}

                </p>

                <div className="mt-4 h-3 rounded-full bg-slate-800">

                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
                    style={{ width: `${goal.progress}%` }}
                  ></div>

                </div>

                <p className="mt-4 text-sm text-slate-400">

                  {goal.status}

                </p>

              </div>

            ))}

          </div>

          <div className="mt-10 flex flex-wrap gap-6">

            <Link
              href="/family"
              className="rounded-xl bg-green-600 px-8 py-4 text-lg font-bold hover:bg-green-500"
            >

              Open Family Platform

            </Link>

            <Link
              href="/notifications"
              className="rounded-xl border border-slate-500 px-8 py-4 text-lg font-bold hover:border-slate-300"
            >

              Review Family Alerts

            </Link>

          </div>

        </div>

      </section>

    </main>

  );
}
