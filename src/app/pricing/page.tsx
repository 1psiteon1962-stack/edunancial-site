import Link from "next/link";

import PricingTable from "@/components/membership/PricingTable";
import { membershipPlans } from "@/types/membership";

export const metadata = {
  title: "Pricing | Edunancial",
  description:
    "Compare Edunancial membership pricing, included features, and the best starting point for your financial competency journey.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">Pricing</p>
        <h1 className="mt-6 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Choose the membership that matches your next stage of growth.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          Start with the essentials, unlock guided tools and downloadable learning, or move
          into full AI-supported progress with premium access.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {membershipPlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl border p-6 ${
                plan.featured
                  ? "border-yellow-400 bg-yellow-400/10"
                  : "border-white/10 bg-slate-900/80"
              }`}
            >
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-300">{plan.name}</p>
              <p className="mt-4 text-4xl font-black">${plan.monthlyPrice}</p>
              <p className="mt-2 text-sm text-slate-400">per month</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {plan.aiCoachIncluded ? "Includes AI coach access" : "Great for getting started"}.
                {plan.downloadableCourses ? " Downloadable course support included." : " Public learning access focused."}
              </p>
              <Link
                href={plan.monthlyPrice === 0 ? "/register" : `/membership/checkout?plan=${plan.id}`}
                className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                {plan.monthlyPrice === 0 ? "Create free account" : `Choose ${plan.name}`}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <PricingTable />
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/membership"
            className="rounded-xl bg-yellow-400 px-6 py-4 font-black text-slate-950 transition hover:bg-yellow-300"
          >
            View Membership Details
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-white/20 px-6 py-4 font-bold transition hover:bg-white hover:text-slate-950"
          >
            Contact Sales &amp; Support
          </Link>
        </div>
      </section>
    </main>
  );
}
