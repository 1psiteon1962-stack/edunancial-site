"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import InvestmentGrowthCalculator from "@/components/investing/InvestmentGrowthCalculator";
import { useAuth } from "@/lib/authContext";
import { normalizeToCurriculumTier } from "@/lib/curriculum/access";

const TIER_RANK = {
  free: 0,
  basic: 1,
  pro: 2,
  gold: 3,
} as const;

export default function InvestmentGrowthToolClient() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?next=/tools/investment-growth");
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08101f] px-6 text-white">
        <p className="text-slate-400">Loading investment tools…</p>
      </main>
    );
  }

  const normalizedTier = normalizeToCurriculumTier(user.membershipTier);
  const hasLevelTwoAccess = TIER_RANK[normalizedTier] >= TIER_RANK.basic;

  if (!hasLevelTwoAccess) {
    return (
      <main className="min-h-screen bg-[#08101f] px-6 py-16 text-white">
        <section className="mx-auto max-w-3xl rounded-3xl border border-yellow-500/30 bg-slate-950/90 p-8 shadow-2xl shadow-black/20">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-yellow-300">Level 2+ member tool</p>
          <h1 className="mt-4 text-4xl font-black">Investment Growth Calculator</h1>
          <p className="mt-4 leading-7 text-slate-300">
            This interactive calculator is available with Basic, Pro, and Gold curriculum access. It lets you replace Edunancial&apos;s default $40-per-week example with your own starting balance, contribution schedule, expected return, time horizon, and currency.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/membership" className="rounded-xl bg-yellow-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-yellow-300">
              View Membership Options
            </Link>
            <Link href="/dashboard" className="rounded-xl border border-slate-600 px-5 py-3 font-bold text-slate-200 transition hover:border-white hover:text-white">
              Return to Dashboard
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-12 text-white sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-300">Member Tools</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Investment Growth Planner</h1>
          </div>
          <Link href="/dashboard" className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-white hover:text-white">
            Back to Dashboard
          </Link>
        </div>
        <InvestmentGrowthCalculator />
      </div>
    </main>
  );
}
