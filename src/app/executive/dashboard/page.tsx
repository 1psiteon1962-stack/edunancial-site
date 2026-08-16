import Link from "next/link";
import ExecutiveKPICard from "@/components/executive/ExecutiveKPICard";
import GeoSummaryTable from "@/components/executive/GeoSummaryTable";
import SystemHealthCard from "@/components/executive/SystemHealthCard";
import { requireOwnerPageSession } from "@/lib/admin-content/auth";
import { getExecutiveSnapshot } from "@/lib/executive/adapters";

export const metadata = { title: "Executive Dashboard | Edunancial" };
export const dynamic = "force-dynamic";

export default async function ExecutiveDashboardPage() {
  await requireOwnerPageSession();
  const snap = await getExecutiveSnapshot();
  const { revenue: rev, membership: mem, courses: crs, system: sys, marketing: mkt } = snap;
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.4em] text-yellow-400">Executive Command Center</p><h1 className="mt-2 text-4xl font-black">Do I Know My Numbers?</h1><p className="mt-1 text-sm text-slate-500">Last updated: {new Date(snap.generatedAt).toLocaleString()}</p></div>
        <div className="flex flex-wrap gap-2"><Link href="/executive/kpi/export" className="rounded-lg border border-yellow-500/40 px-4 py-2 text-sm font-semibold text-yellow-400 hover:bg-yellow-500/10">↓ Export CSV</Link><Link href="/executive/kpi" className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-yellow-400">Know Your Numbers →</Link></div>
      </div>
      <section className="mt-10"><h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Revenue</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ExecutiveKPICard label="Today's Revenue" value={`$${rev.today.value.toLocaleString()}`} status={rev.today.status} accent="border-yellow-500" /><ExecutiveKPICard label="Month-to-Date Revenue" value={`$${rev.monthToDate.value.toLocaleString()}`} status={rev.monthToDate.status} accent="border-yellow-500" /><ExecutiveKPICard label="MRR" value={`$${rev.mrr.value.toLocaleString()}`} status={rev.mrr.status} accent="border-green-500" /><ExecutiveKPICard label="LTV" value={`$${rev.ltv.value.toLocaleString()}`} status={rev.ltv.status} accent="border-blue-500" />
      </div></section>
      <section className="mt-10"><h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Acquisition & Growth — Month to Date</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ExecutiveKPICard label="Visitors" value={mkt.visitors.value.toLocaleString()} status={mkt.visitors.status} accent="border-cyan-500" /><ExecutiveKPICard label="Signups" value={mkt.membershipSignups.value.toLocaleString()} status={mkt.membershipSignups.status} accent="border-cyan-500" /><ExecutiveKPICard label="Customers" value={mkt.conversions.value.toLocaleString()} status={mkt.conversions.status} accent="border-green-500" /><ExecutiveKPICard label="CAC" value={`$${mkt.cac.value.toFixed(2)}`} status={mkt.cac.status} accent="border-yellow-500" /><ExecutiveKPICard label="CPA / Signup" value={`$${mkt.cpa.value.toFixed(2)}`} status={mkt.cpa.status} accent="border-yellow-500" /><ExecutiveKPICard label="ROAS" value={`${mkt.roas.value.toFixed(2)}x`} status={mkt.roas.status} accent="border-purple-500" /><ExecutiveKPICard label="Organic Visits" value={mkt.organicSearch.value.toLocaleString()} status={mkt.organicSearch.status} accent="border-green-500" /><ExecutiveKPICard label="Referral Visits" value={mkt.referralTraffic.value.toLocaleString()} status={mkt.referralTraffic.status} accent="border-blue-500" />
      </div><p className="mt-3 text-xs text-slate-500">CAC, CPA and ROAS use actual marketing-spend records. Until spend and customer events exist, zero is a baseline—not a projection.</p></section>
      <section className="mt-10"><h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Membership</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><ExecutiveKPICard label="Active Members" value={mem.active.value.toLocaleString()} status={mem.active.status} accent="border-blue-500" /><ExecutiveKPICard label="New Members Today" value={mem.newToday.value.toLocaleString()} status={mem.newToday.status} accent="border-blue-500" /><ExecutiveKPICard label="Membership Growth" value={`${mem.growthRate.value}%`} status={mem.growthRate.status} accent="border-blue-500" /><ExecutiveKPICard label="Monthly Churn" value={`${mem.monthlyChurn.value}%`} status={mem.monthlyChurn.status} accent="border-red-500" /></div></section>
      <section className="mt-10"><h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Platform</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><ExecutiveKPICard label="Course Completions Today" value={crs.completionsToday.value.toLocaleString()} status={crs.completionsToday.status} accent="border-purple-500" /><ExecutiveKPICard label="Avg Completion Rate" value={`${crs.avgCompletionRate.value}%`} status={crs.avgCompletionRate.status} accent="border-purple-500" /><ExecutiveKPICard label="Certificates Issued" value={crs.certificatesIssued.value.toLocaleString()} status={crs.certificatesIssued.status} accent="border-purple-500" /><ExecutiveKPICard label="AI Conversations" value={snap.ai.questionsAsked.value.toLocaleString()} status={snap.ai.questionsAsked.status} accent="border-cyan-500" /></div></section>
      <section className="mt-10"><h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">System Health</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><SystemHealthCard name={sys.application.name} status={sys.application.status} latencyMs={sys.application.latencyMs} /><SystemHealthCard name={sys.database.name} status={sys.database.status} latencyMs={sys.database.latencyMs} /><SystemHealthCard name={sys.supabase.name} status={sys.supabase.status} latencyMs={sys.supabase.latencyMs} /><SystemHealthCard name={sys.netlify.name} status={sys.netlify.status} latencyMs={sys.netlify.latencyMs} /></div></section>
      <section className="mt-10"><div className="mb-4 flex items-center justify-between"><h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Global Overview</h2><Link href="/executive/analytics" className="text-xs text-slate-500 hover:text-slate-300">Full analytics →</Link></div><GeoSummaryTable data={snap.geo} /></section>
    </main>
  );
}
