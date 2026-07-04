import Link from "next/link";

import { membershipPlans } from "@/types/membership";

export default function MembershipPage() {

  return (

    <main className="mx-auto max-w-7xl px-6 py-12">

      <section className="text-center">

        <h1 className="text-5xl font-bold">

          Become an Edunancial Member

        </h1>

        <p className="mt-6 text-xl text-slate-600">

          Financial literacy teaches knowledge.

          Financial competency develops the ability to make
          better financial decisions throughout life.

        </p>

      </section>

      <section className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

        {membershipPlans.map(plan => (

          <div
            key={plan.id}
            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
          >

            <h2 className="text-3xl font-bold">

              {plan.name}

            </h2>

            <div className="mt-6">

              <span className="text-5xl font-bold">

                ${plan.monthlyPrice}

              </span>

              <span className="ml-2 text-slate-500">

                /month

              </span>

            </div>

            <ul className="mt-8 space-y-3 text-left">

              <li>

                {plan.assessmentIncluded
                  ? "✓"
                  : "—"} Financial Competency Assessment

              </li>

              <li>

                {plan.marketplaceIncluded
                  ? "✓"
                  : "—"} Marketplace Access

              </li>

              <li>

                {plan.aiCoachIncluded
                  ? "✓"
                  : "—"} AI Coach

              </li>

              <li>

                {plan.downloadableCourses
                  ? "✓"
                  : "—"} Downloadable Courses

              </li>

              <li>

                {plan.prioritySupport
                  ? "✓"
                  : "—"} Priority Support

              </li>

            </ul>

            <Link

              href={`/membership/checkout?plan=${plan.id}`}

              className="mt-10 inline-flex w-full justify-center rounded-xl bg-blue-700 px-6 py-4 font-semibold text-white hover:bg-blue-800"

            >

              Select {plan.name}

            </Link>

          </div>

        ))}

      </section>

      <section className="mt-24 rounded-2xl bg-slate-100 p-10">

        <h2 className="text-3xl font-bold">

          Why Become a Member?

        </h2>

        <div className="mt-8 grid gap-8 md:grid-cols-2">

          <div>

            <h3 className="font-semibold">

              Learn

            </h3>

            <p>

              Structured financial education designed to build
              financial competency.

            </p>

          </div>

          <div>

            <h3 className="font-semibold">

              Assess

            </h3>

            <p>

              Measure your competency and monitor your progress
              over time.

            </p>

          </div>

          <div>

            <h3 className="font-semibold">

              Connect

            </h3>

            <p>

              Access trusted professionals in your local
              marketplace.

            </p>

          </div>

          <div>

            <h3 className="font-semibold">

              Grow

            </h3>

            <p>

              Build the knowledge, discipline, and habits needed
              to improve your financial future.

            </p>

          </div>

        </div>

      </section>

    </main>

  );

}
