"use client";

import Link from "next/link";

const PRIMARY_KPIS = [
  ["Gross Revenue", "$0.00", "Revenue received before refunds and taxes"],
  ["Net Revenue", "$0.00", "Revenue after refunds, discounts and taxes"],
  ["MRR", "$0.00", "Monthly recurring membership revenue"],
  ["ARR", "$0.00", "Annualized recurring membership revenue"],
  ["Active Members", "0", "Currently active paid memberships"],
  ["New Members · 30D", "0", "New paid members in the last 30 days"],
  ["Conversion · 30D", "—", "Visitor-to-paid conversion rate"],
  ["Membership Churn", "—", "Paid memberships lost during the period"],
] as const;

const OPERATING_KPIS = [
  ["Total Customers", "0"], ["Courses Sold", "0"], ["Course Completion", "—"],
  ["Avg Competency Score", "—"], ["Countries Served", "0"], ["Tax Collected", "$0.00"],
  ["Tax Jurisdictions Active", "0"], ["Failed Payments", "0"],
] as const;

const QUICK_LINKS = [
  ["Country Launch Controls", "/admin/regions", "🌎"], ["Customer Management", "/admin/customers", "👥"],
  ["Membership Management", "/admin/memberships", "🏆"], ["Curriculum Manager", "/admin/curriculum", "📖"],
  ["Course Management", "/admin/courses", "📚"], ["Content Upload Portal", "/admin/content", "📦"],
  ["Revenue & Profit", "/admin/profit-dashboard", "💰"], ["Analytics & KPIs", "/admin/kpi", "📊"],
  ["Security Center", "/admin/security-center", "🔐"],
] as const;

export default function AdminDashboardClient() {
  return <main className="min-h-screen bg-[#08101f] text-white"><div className="mx-auto max-w-7xl px-6 py-10">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">Administration · Top Priority</p><h1 className="mt-3 text-4xl font-black sm:text-5xl">Executive KPI Command Center</h1><p className="mt-2 max-w-3xl text-slate-400">One operating view for revenue, membership growth, learning outcomes, regional expansion, tax exposure and platform health.</p></div><div className="flex gap-3"><Link href="/admin/regions" className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold hover:bg-blue-600">Country Controls</Link><Link href="/admin" className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold hover:border-white">← All Modules</Link></div></div>
    <div className="mt-8 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">{["Today", "7 Days", "30 Days", "Quarter", "Year", "All Time"].map((period) => <span key={period} className="rounded-full border border-white/10 bg-[#101a2f] px-4 py-2">{period}</span>)}</div>
    <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{PRIMARY_KPIS.map(([label,value,detail]) => <article key={label} className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-3 text-3xl font-black">{value}</p><p className="mt-3 text-xs leading-5 text-slate-500">{detail}</p></article>)}</section>
    <section className="mt-8 grid gap-6 lg:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6 lg:col-span-2"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Revenue & Member Growth</h2><span className="text-xs text-slate-500">Live source connection pending</span></div><div className="mt-6 flex h-56 items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/30 text-sm text-slate-500">Time-series chart area · revenue · members · conversion</div></div><div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"><h2 className="text-xl font-bold">Executive Alerts</h2><div className="mt-5 space-y-3 text-sm"><div className="rounded-xl bg-slate-950/30 p-4"><b>Data connections</b><p className="mt-1 text-slate-500">KPIs remain zero until production data sources are connected.</p></div><div className="rounded-xl bg-slate-950/30 p-4"><b>Tax exposure</b><p className="mt-1 text-slate-500">Nexus and registration alerts will surface here.</p></div><div className="rounded-xl bg-slate-950/30 p-4"><b>Regional readiness</b><p className="mt-1 text-slate-500">Use Country Controls to activate, stage or immediately disable a market.</p></div></div></div></section>
    <section className="mt-8"><h2 className="text-xl font-bold">Operating KPIs</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{OPERATING_KPIS.map(([label,value]) => <div key={label} className="rounded-xl border border-white/10 bg-[#101a2f] p-5"><p className="text-xs text-slate-400">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div>)}</div></section>
    <section className="mt-8 grid gap-6 lg:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold">Regional Performance</h2><Link href="/admin/regions" className="text-sm font-bold text-blue-400">Manage countries →</Link></div><p className="mt-2 text-sm text-slate-500">Revenue, customers, active members, courses sold and tax collected by region and country.</p><div className="mt-5 rounded-xl bg-slate-950/30 p-5 text-sm text-slate-500">North America active · Central America, South America and Caribbean staged behind runtime launch controls.</div></div><div className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"><h2 className="text-xl font-bold">Tax & Compliance</h2><p className="mt-2 text-sm text-slate-500">Nexus thresholds, registrations, tax collected, filing status and approaching obligations.</p><div className="mt-5 rounded-xl bg-slate-950/30 p-5 text-sm text-slate-500">Unified jurisdiction-aware tax engine integration is configuration-driven.</div></div></section>
    <section className="mt-8"><h2 className="text-xl font-bold">Administration Modules</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{QUICK_LINKS.map(([title,href,icon]) => <Link key={title} href={href} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#101a2f] p-5 hover:border-blue-500"><span className="text-xl">{icon}</span><span className="font-semibold">{title}</span></Link>)}</div></section>
  </div></main>;
}
