import Link from "next/link";

import { MembershipPlan } from "@/types/membership";

interface MembershipCardProps {
  plan: MembershipPlan;
}

export default function MembershipCard({
  plan,
}: MembershipCardProps) {
  return (
    <div
      className={`rounded-2xl border p-8 shadow-sm transition-all ${
        plan.featured
          ? "border-blue-700 bg-blue-50"
          : "border-slate-200 bg-white"
      }`}
    >
      {plan.featured && (
        <div className="mb-6 inline-flex rounded-full bg-blue-700 px-4 py-1 text-sm font-semibold text-white">
          Most Popular
        </div>
      )}

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

      <p className="mt-2 text-sm text-slate-500">
        Annual Billing: ${plan.annualPrice}
      </p>

      <div className="my-8 border-t border-slate-200" />

      <ul className="space-y-3">

        <li>
          {plan.assessmentIncluded ? "✓" : "—"} Financial Competency Assessment
        </li>

        <li>
          {plan.marketplaceIncluded ? "✓" : "—"} Marketplace Access
        </li>

        <li>
          {plan.aiCoachIncluded ? "✓" : "—"} AI Financial Coach
        </li>

        <li>
          {plan.downloadableCourses ? "✓" : "—"} Downloadable Courses
        </li>

        <li>
          {plan.prioritySupport ? "✓" : "—"} Priority Support
        </li>

        <li>
          Certificates: {plan.maxCertificates}
        </li>

      </ul>

      <Link
        href={`/membership/checkout?plan=${plan.id}`}
        className="mt-10 flex w-full items-center justify-center rounded-xl bg-blue-700 px-6 py-4 font-semibold text-white transition hover:bg-blue-800"
      >
        Choose {plan.name}
      </Link>
    </div>
  );
}
