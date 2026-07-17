import Link from "next/link";

import KPIGaugeCard from "@/components/executive/KPIGaugeCard";
import { requireOwnerPageSession } from "@/lib/admin-content/auth";
import { getKPIGoals } from "@/lib/executive/adapters";

export const metadata = {
  title: "Know Your Numbers | Edunancial Executive",
};

export const dynamic = "force-dynamic";

export default async function ExecutiveKPIPage() {
  await requireOwnerPageSession();
  const goals = await getKPIGoals();

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-yellow-400">
            Key Performance Indicators
          </p>
          <h1 className="mt-2 text-4xl font-black">Know Your Numbers</h1>
          <p className="mt-2 text-slate-400">
            Track progress against your business goals at a glance.
          </p>
        </div>
        <Link
          href="/api/executive/kpi/export"
          className="rounded-lg border border-yellow-500/40 px-4 py-2 text-sm font-semibold text-yellow-400 hover:bg-yellow-500/10"
        >
          ↓ Export CSV
        </Link>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KPIGaugeCard goal={goals.revenueGoal} />
        <KPIGaugeCard goal={goals.membershipGoal} />
        <KPIGaugeCard goal={goals.trafficGoal} />
        <KPIGaugeCard goal={goals.courseCompletionGoal} />
        <KPIGaugeCard goal={goals.customerSatisfactionGoal} />
        <KPIGaugeCard goal={goals.monthlyGrowthGoal} />
        <KPIGaugeCard goal={goals.annualGrowthGoal} />
        <KPIGaugeCard goal={goals.netProfitGoal} />
      </div>

      <div className="mt-10 rounded-xl border border-white/5 bg-[#101a2f] p-6">
        <h2 className="font-bold">About these goals</h2>
        <p className="mt-2 text-sm text-slate-400">
          Goals are pre-configured defaults. Connect your data sources to populate actuals.
          Goal targets will be owner-configurable via Supabase once the configuration table is implemented.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
          <span className="rounded-full border border-green-500/30 px-3 py-1 text-green-400">≥ 90% · On Track</span>
          <span className="rounded-full border border-yellow-500/30 px-3 py-1 text-yellow-400">60–89% · Near Target</span>
          <span className="rounded-full border border-orange-500/30 px-3 py-1 text-orange-400">30–59% · Below Target</span>
          <span className="rounded-full border border-red-500/30 px-3 py-1 text-red-400">&lt; 30% · Critical</span>
        </div>
      </div>

      <div className="mt-6 text-right">
        <Link href="/executive/dashboard" className="text-sm text-slate-500 hover:text-slate-300">
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
