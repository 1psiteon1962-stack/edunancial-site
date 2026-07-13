import Link from "next/link";

import { publicMembershipPlans } from "@/types/membership";

export default function HomeMembershipSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Membership
        </p>

        <h2 className="mt-4 text-5xl font-bold">Become an Edunancial Member</h2>

        <p className="mx-auto mt-8 max-w-3xl text-xl text-slate-300">
          Membership develops lifelong financial competency through structured learning resources,
          practical exercises, guided sessions, and continuous improvement.
        </p>
      </div>

      <div className="mt-20 grid gap-8 lg:grid-cols-3">
        {publicMembershipPlans.map((plan) => (
          <div
            key={plan.name}
            className="rounded-2xl border border-slate-700 bg-slate-900/60 p-8"
          >
            <h3 className="text-3xl font-bold">{plan.name}</h3>

            <p className="mt-4 text-5xl font-extrabold">${plan.monthlyPrice.toFixed(2)}</p>
            <p className="mt-2 text-sm text-slate-400">{plan.billingLabel}</p>

            <p className="mt-6 text-slate-300">{plan.description}</p>

            <ul className="mt-8 space-y-3">
              <li>✓ Financial Competency Assessment</li>
              <li>✓ Structured learning resources</li>
              <li>✓ Member tools and guided sessions</li>
              <li>✓ Practical financial training</li>
            </ul>

            <Link
              href={plan.showContactOnly ? "/contact" : `/membership/checkout?plan=${plan.id}`}
              className="mt-10 inline-flex rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white"
            >
              Learn More
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
