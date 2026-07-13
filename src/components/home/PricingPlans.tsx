import Link from "next/link";

import { publicMembershipPlans } from "@/types/membership";

export default function PricingPlans() {
  return (
    <section className="bg-[#08101f] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-5xl font-black">Membership Plans</h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {publicMembershipPlans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-2xl border border-slate-700 bg-[#111827] p-8"
            >
              <h3 className="text-3xl font-black">{plan.name}</h3>

              <p className="mt-6 text-4xl font-bold">${plan.monthlyPrice.toFixed(2)}</p>
              <p className="mt-2 text-sm text-slate-400">{plan.billingLabel}</p>
              <ul className="mt-8 space-y-3">
                <li>• Financial Competency Assessment</li>
                <li>• Guided member resources</li>
                <li>• Practical financial tools</li>
              </ul>

              <Link
                href={plan.showContactOnly ? "/contact" : `/membership/checkout?plan=${plan.id}`}
                className="mt-10 inline-block rounded-xl bg-blue-600 px-8 py-4 font-bold"
              >
                {plan.ctaLabel}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
