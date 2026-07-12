import Link from "next/link";

import PricingTable from "@/components/membership/PricingTable";
import { EDUNANCIAL_IDENTITY, EDUNANCIAL_PUBLIC_DISCLAIMER } from "@/lib/positioning";
import { publicMembershipPlans } from "@/types/membership";

export const metadata = {
  title: "Pricing | Edunancial",
  description:
    "Compare Edunancial membership pricing, approved organization rates, and beta-access rules.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">Pricing</p>
        <h1 className="mt-6 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Membership pricing built for individuals and approved organizations.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          {EDUNANCIAL_IDENTITY} Public pricing is limited to Individual Membership, Approved
          Organization Membership, and the 100+ Member Organization Rate.
        </p>
        <p className="mt-4 max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
          {EDUNANCIAL_PUBLIC_DISCLAIMER}
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {publicMembershipPlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl border p-6 ${
                plan.featured
                  ? "border-yellow-400 bg-yellow-400/10"
                  : "border-white/10 bg-slate-900/80"
              }`}
            >
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-300">{plan.name}</p>
              <p className="mt-4 text-4xl font-black">${plan.monthlyPrice.toFixed(2)}</p>
              <p className="mt-2 text-sm text-slate-400">{plan.billingLabel}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {plan.description}
              </p>
              {plan.legalNote && <p className="mt-4 text-xs leading-6 text-slate-400">{plan.legalNote}</p>}
              <Link
                href={plan.showContactOnly ? "/contact" : `/membership/checkout?plan=${plan.id}`}
                className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                {plan.ctaLabel}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-slate-400">
          Beta Tester access is invitation only, priced at $0, and intentionally hidden from public pricing cards.
        </p>
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
