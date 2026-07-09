import Link from "next/link";

import FeatureAvailabilityGate from "@/components/global-rollout/FeatureAvailabilityGate";

export const metadata = {
  title: "Financial Competency Passport | Edunancial",
  description:
    "Your lifelong Financial Competency Passport.",
};

export default function PassportPage() {
  return (
    <FeatureAvailabilityGate
      feature="financialPassport"
      featureLabel="Financial Competency Passport"
    >
      <main className="min-h-screen bg-[#08101f] text-white">
        <section className="mx-auto max-w-7xl px-6 py-24">
          <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
            FINANCIAL COMPETENCY PASSPORT
          </p>

          <h1 className="mt-8 text-7xl font-black">
            Your Financial
            <br />
            Competency Passport
          </h1>

          <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">
            Unlike a traditional report card,
            your Financial Competency Passport
            grows with you throughout your lifetime.
          </p>

          <div className="mt-20 grid gap-8 md:grid-cols-4">
            <div className="rounded-2xl bg-blue-700 p-10 text-center">
              <p className="uppercase">
                Overall Score
              </p>
              <h2 className="mt-6 text-6xl font-black">
                82
              </h2>
            </div>

            <div className="rounded-2xl bg-red-700 p-10 text-center">
              <p className="uppercase">
                Courses
              </p>
              <h2 className="mt-6 text-6xl font-black">
                14
              </h2>
            </div>

            <div className="rounded-2xl bg-green-700 p-10 text-center">
              <p className="uppercase">
                Assessments
              </p>
              <h2 className="mt-6 text-6xl font-black">
                5
              </h2>
            </div>

            <div className="rounded-2xl bg-yellow-600 p-10 text-center">
              <p className="uppercase">
                Certificates
              </p>
              <h2 className="mt-6 text-6xl font-black">
                6
              </h2>
            </div>
          </div>

          <div className="mt-20 rounded-2xl bg-slate-900 p-10">
            <h2 className="text-4xl font-black">
              Lifetime Competency Timeline
            </h2>
            <div className="mt-12 space-y-8">
              <div className="rounded-xl bg-slate-800 p-6">
                <h3 className="text-2xl font-bold">
                  January 2027
                </h3>
                <p className="mt-4">
                  Initial Financial Competency Assessment Completed
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-6">
                <h3 className="text-2xl font-bold">
                  March 2027
                </h3>
                <p className="mt-4">
                  Business Competency Certificate Earned
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-6">
                <h3 className="text-2xl font-bold">
                  June 2027
                </h3>
                <p className="mt-4">
                  Overall Competency Increased 12%
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl bg-slate-900 p-10">
              <h2 className="text-4xl font-black">
                Certifications Earned
              </h2>
              <div className="mt-10 space-y-6">
                <div className="rounded-xl border border-green-500 p-6">
                  <h3 className="text-2xl font-bold">
                    Personal Financial Management
                  </h3>
                  <p className="mt-4 text-slate-300">
                    Successfully completed.
                  </p>
                </div>

                <div className="rounded-xl border border-blue-500 p-6">
                  <h3 className="text-2xl font-bold">
                    Business Fundamentals
                  </h3>
                  <p className="mt-4 text-slate-300">
                    Successfully completed.
                  </p>
                </div>

                <div className="rounded-xl border border-red-500 p-6">
                  <h3 className="text-2xl font-bold">
                    Real Estate Foundations
                  </h3>
                  <p className="mt-4 text-slate-300">
                    Successfully completed.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900 p-10">
              <h2 className="text-4xl font-black">
                Current Goals
              </h2>
              <div className="mt-10 space-y-8">
                <div>
                  <div className="flex justify-between">
                    <span>Overall Financial Competency</span>
                    <span>82 / 100</span>
                  </div>
                  <div className="mt-3 h-4 rounded-full bg-slate-700">
                    <div className="h-4 w-[82%] rounded-full bg-green-500"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between">
                    <span>Course Completion</span>
                    <span>14 / 20</span>
                  </div>
                  <div className="mt-3 h-4 rounded-full bg-slate-700">
                    <div className="h-4 w-[70%] rounded-full bg-blue-500"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between">
                    <span>Lifetime Goal</span>
                    <span>Financial Competency Master</span>
                  </div>
                  <div className="mt-3 h-4 rounded-full bg-slate-700">
                    <div className="h-4 w-[45%] rounded-full bg-yellow-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 rounded-2xl border border-yellow-500 bg-[#111827] p-10">
            <h2 className="text-4xl font-black">
              Your Financial Journey Never Ends
            </h2>
            <p className="mt-8 text-xl leading-9 text-slate-300">
              Your Financial Competency Passport is designed to grow
              with you throughout your lifetime.
              Every assessment,
              every completed course,
              every certification,
              and every improvement becomes part of your permanent
              competency record.
            </p>
          </div>

          <div className="mt-20 flex flex-wrap gap-6">
            <Link
              href="/dashboard"
              className="rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold hover:bg-blue-700"
            >
              View Dashboard
            </Link>

            <Link
              href="/courses"
              className="rounded-xl border border-white px-10 py-5 text-xl font-bold hover:bg-white hover:text-black"
            >
              Continue Learning
            </Link>

            <Link
              href="/assessment"
              className="rounded-xl border border-green-500 px-10 py-5 text-xl font-bold hover:bg-green-600"
            >
              Retake Assessment
            </Link>
          </div>
        </section>
      </main>
    </FeatureAvailabilityGate>
  );
}
