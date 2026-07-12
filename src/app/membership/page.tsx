import Link from "next/link";

import {
  EDUNANCIAL_LONG_DESCRIPTION,
  EDUNANCIAL_METHODS_CLARIFICATION,
  EDUNANCIAL_PUBLIC_DISCLAIMER,
} from "@/lib/positioning";
import { publicMembershipPlans } from "@/types/membership";

export const metadata = {
  title: "Edunancial Membership | Financial Literacy Membership Platform",
  description: EDUNANCIAL_LONG_DESCRIPTION,
};

export default function MembershipPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
          Membership
        </p>
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Become an Edunancial member and build practical financial literacy and financial competency.
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          {EDUNANCIAL_LONG_DESCRIPTION}
        </p>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-400">
          {EDUNANCIAL_METHODS_CLARIFICATION}
        </p>
        <p className="mt-6 max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
          {EDUNANCIAL_PUBLIC_DISCLAIMER}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/assessment" className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700">
            Start Assessment
          </Link>
          <Link href="/north-america" className="rounded-xl border border-white/60 px-8 py-4 text-lg font-bold hover:bg-white hover:text-slate-950">
            North America Launch
          </Link>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-950/70">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-4xl font-black">Choose your starting point.</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {publicMembershipPlans.map((plan) => (
              <div key={plan.id} className="rounded-2xl border border-white/10 bg-white p-8 text-slate-950 shadow-xl">
                <h3 className="text-3xl font-black">{plan.name}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{plan.description}</p>
                <div className="mt-6">
                  <span className="text-5xl font-black">${plan.monthlyPrice.toFixed(2)}</span>
                  <span className="ml-2 text-slate-500">{plan.billingLabel}</span>
                </div>
                <ul className="mt-8 space-y-3 text-left text-sm font-semibold text-slate-700">
                  <li>{plan.assessmentIncluded ? "Yes" : "No"} - Competency Assessment</li>
                  <li>{plan.marketplaceIncluded ? "Yes" : "No"} - Marketplace Access</li>
                  <li>{plan.aiCoachIncluded ? "Yes" : "No"} - AI Coach</li>
                  <li>{plan.downloadableCourses ? "Yes" : "No"} - Downloadable Learning Resources</li>
                  <li>{plan.prioritySupport ? "Yes" : "No"} - Priority Support</li>
                </ul>
                {plan.legalNote && <p className="mt-6 text-xs leading-6 text-slate-500">{plan.legalNote}</p>}
                <Link
                  href={plan.showContactOnly ? "/contact" : `/membership/checkout?plan=${plan.id}`}
                  className="mt-10 inline-flex w-full justify-center rounded-xl bg-blue-700 px-6 py-4 font-bold text-white hover:bg-blue-800"
                >
                  {plan.ctaLabel}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-4">
          {[
            ["Learn", "Structured learning resources across real estate, paper assets, and business."],
            ["Assess", "Measure your financial competency and track improvement."],
            ["Apply", "Use practical exercises and member tools to convert lessons into decisions."],
            ["Grow", "Build habits designed to support long-term financial progress."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h3 className="text-2xl font-black">{title}</h3>
              <p className="mt-4 leading-7 text-slate-300">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
