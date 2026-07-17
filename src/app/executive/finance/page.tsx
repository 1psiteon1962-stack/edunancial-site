import Link from "next/link";

import ExecutiveKPICard from "@/components/executive/ExecutiveKPICard";
import { requireOwnerPageSession } from "@/lib/admin-content/auth";
import { getFinancialKPIs, getRevenueKPIs } from "@/lib/executive/adapters";

export const metadata = {
  title: "Financial Dashboard | Edunancial Executive",
};

export const dynamic = "force-dynamic";

export default async function ExecutiveFinancePage() {
  await requireOwnerPageSession();
  const [fin, rev] = await Promise.all([getFinancialKPIs(), getRevenueKPIs()]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-yellow-400">
            Financial Dashboard
          </p>
          <h1 className="mt-2 text-4xl font-black">Financial Overview</h1>
          <p className="mt-2 text-slate-400">
            Revenue, profit, margins, and cash position.
          </p>
        </div>
        <Link href="/executive/dashboard" className="text-sm text-slate-500 hover:text-slate-300">
          ← Dashboard
        </Link>
      </div>

      {/* Revenue */}
      <section className="mt-10">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Revenue</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ExecutiveKPICard label="MRR" value={`$${rev.mrr.value.toLocaleString()}`} status={rev.mrr.status} accent="border-yellow-500" />
          <ExecutiveKPICard label="ARR" value={`$${rev.arr.value.toLocaleString()}`} status={rev.arr.status} accent="border-yellow-500" />
          <ExecutiveKPICard label="Recurring Revenue" value={`$${rev.recurringRevenue.value.toLocaleString()}`} status={rev.recurringRevenue.status} accent="border-green-500" />
          <ExecutiveKPICard label="One-Time Revenue" value={`$${rev.oneTimeRevenue.value.toLocaleString()}`} status={rev.oneTimeRevenue.status} accent="border-green-500" />
          <ExecutiveKPICard label="Refunds" value={`$${rev.refunds.value.toLocaleString()}`} status={rev.refunds.status} accent="border-red-500" />
          <ExecutiveKPICard label="ARPU" value={`$${rev.arpu.value.toLocaleString()}`} status={rev.arpu.status} accent="border-blue-500" />
          <ExecutiveKPICard label="LTV" value={`$${rev.ltv.value.toLocaleString()}`} status={rev.ltv.status} accent="border-blue-500" />
        </div>
      </section>

      {/* P&L */}
      <section className="mt-10">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Profit & Loss</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ExecutiveKPICard label="Revenue" value={`$${fin.revenue.value.toLocaleString()}`} status={fin.revenue.status} accent="border-green-500" />
          <ExecutiveKPICard label="Expenses" value={`$${fin.expenses.value.toLocaleString()}`} status={fin.expenses.status} accent="border-red-500" />
          <ExecutiveKPICard label="Gross Profit" value={`$${fin.grossProfit.value.toLocaleString()}`} status={fin.grossProfit.status} accent="border-yellow-500" />
          <ExecutiveKPICard label="Net Profit" value={`$${fin.netProfit.value.toLocaleString()}`} status={fin.netProfit.status} accent="border-yellow-500" />
          <ExecutiveKPICard label="Cash Position" value={`$${fin.cashPosition.value.toLocaleString()}`} status={fin.cashPosition.status} accent="border-blue-500" />
          <ExecutiveKPICard label="Monthly Burn Rate" value={`$${fin.monthlyBurnRate.value.toLocaleString()}`} status={fin.monthlyBurnRate.status} accent="border-orange-500" />
          <ExecutiveKPICard label="Gross Margin" value={`${fin.grossMargin.value}%`} status={fin.grossMargin.status} accent="border-purple-500" />
          <ExecutiveKPICard label="Net Margin" value={`${fin.netMargin.value}%`} status={fin.netMargin.status} accent="border-purple-500" />
          <ExecutiveKPICard label="Operating Margin" value={`${fin.operatingMargin.value}%`} status={fin.operatingMargin.status} accent="border-purple-500" />
        </div>
      </section>

      {/* Integration Notice */}
      <div className="mt-10 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6">
        <p className="text-sm font-bold text-yellow-400">⚡ Integration Pending</p>
        <p className="mt-2 text-sm text-slate-400">
          Financial data requires connection to your accounting provider (QuickBooks, Xero, or manual entry).
          The adapter layer in <code className="rounded bg-slate-800 px-1">src/lib/executive/adapters.ts</code> exposes
          clear extension points for each data source.
        </p>
      </div>
    </main>
  );
}
