"use client";

import Link from "next/link";

import { useGlobalRollout } from "@/components/global-rollout/GlobalRolloutProvider";
import { getComplianceProfile } from "@/lib/global-rollout/service";

export default function RegionalAvailabilityNotice({
  featureLabel,
}: {
  featureLabel: string;
}) {
  const { activeCountry } = useGlobalRollout();
  const complianceProfile = getComplianceProfile(activeCountry.code);

  return (
    <section
      className="mx-auto max-w-3xl rounded-3xl border border-amber-500/40 bg-slate-900/95 p-8 text-white shadow-2xl"
      role="status"
      aria-live="polite"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
        Region availability
      </p>
      <h2 className="mt-4 text-3xl font-black">Not available in your region yet</h2>
      <p className="mt-4 text-lg leading-8 text-slate-300">
        {featureLabel} is not currently enabled for {activeCountry.name}. This market remains in the rollout queue until legal, payments, privacy, and support readiness are complete.
      </p>
      <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-5 text-sm text-slate-300">
        <p className="font-semibold text-white">Current compliance profile</p>
        <p className="mt-2">{complianceProfile.name}</p>
        <p className="mt-2">{complianceProfile.description}</p>
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/global"
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500"
        >
          Change region preferences
        </Link>
        <Link
          href="/contact"
          className="rounded-xl border border-slate-600 px-5 py-3 font-semibold text-slate-100 hover:border-white"
        >
          Contact support
        </Link>
      </div>
    </section>
  );
}
