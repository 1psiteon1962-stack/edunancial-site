import Link from "next/link";

import ExecutiveKPICard from "@/components/executive/ExecutiveKPICard";
import { requireOwnerPageSession } from "@/lib/admin-content/auth";
import { getMarketingKPIs } from "@/lib/executive/adapters";

export const metadata = {
  title: "Marketing Dashboard | Edunancial Executive",
};

export const dynamic = "force-dynamic";

export default async function ExecutiveMarketingPage() {
  await requireOwnerPageSession();
  const mkt = await getMarketingKPIs();

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-yellow-400">
            Marketing Analytics
          </p>
          <h1 className="mt-2 text-4xl font-black">Marketing Dashboard</h1>
          <p className="mt-2 text-slate-400">
            Traffic, conversions, cost of acquisition, and return on ad spend.
          </p>
        </div>
        <Link href="/executive/dashboard" className="text-sm text-slate-500 hover:text-slate-300">
          ← Dashboard
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Traffic & Conversion</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ExecutiveKPICard label="Website Visitors" value={mkt.visitors.value.toLocaleString()} status={mkt.visitors.status} accent="border-blue-500" />
          <ExecutiveKPICard label="Conversions" value={mkt.conversions.value.toLocaleString()} status={mkt.conversions.status} accent="border-green-500" />
          <ExecutiveKPICard label="Membership Signups" value={mkt.membershipSignups.value.toLocaleString()} status={mkt.membershipSignups.status} accent="border-green-500" />
          <ExecutiveKPICard label="Organic Search" value={mkt.organicSearch.value.toLocaleString()} status={mkt.organicSearch.status} accent="border-blue-500" />
          <ExecutiveKPICard label="Referral Traffic" value={mkt.referralTraffic.value.toLocaleString()} status={mkt.referralTraffic.status} accent="border-blue-500" />
          <ExecutiveKPICard label="Social Traffic" value={mkt.socialTraffic.value.toLocaleString()} status={mkt.socialTraffic.status} accent="border-purple-500" />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Paid Acquisition</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ExecutiveKPICard label="CPA" value={`$${mkt.cpa.value.toLocaleString()}`} status={mkt.cpa.status} accent="border-orange-500" />
          <ExecutiveKPICard label="CAC" value={`$${mkt.cac.value.toLocaleString()}`} status={mkt.cac.status} accent="border-orange-500" />
          <ExecutiveKPICard label="ROAS" value={`${mkt.roas.value}x`} status={mkt.roas.status} accent="border-yellow-500" />
        </div>
      </section>

      {/* Integration channels */}
      <section className="mt-10">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Integration Channels</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Google Analytics 4", status: "pending" },
            { name: "LinkedIn Ads", status: "pending" },
            { name: "Meta / Facebook Ads", status: "pending" },
            { name: "YouTube Analytics", status: "pending" },
          ].map(({ name, status }) => (
            <div key={name} className="rounded-xl border border-white/5 bg-[#101a2f] p-5">
              <p className="font-semibold">{name}</p>
              <p className="mt-1 text-xs text-slate-500 capitalize">{status}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6">
        <p className="text-sm font-bold text-yellow-400">⚡ Integration Pending</p>
        <p className="mt-2 text-sm text-slate-400">
          Connect GA4, LinkedIn, Meta, and YouTube via their respective APIs.
          The adapter in <code className="rounded bg-slate-800 px-1">src/lib/executive/adapters.ts</code>
          exposes the <code className="rounded bg-slate-800 px-1">getMarketingKPIs()</code> function as the extension point.
        </p>
      </div>
    </main>
  );
}
