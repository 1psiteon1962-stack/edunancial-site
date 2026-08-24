"use client";

import Link from "next/link";
import type { ExecutiveOperationsSnapshot, LiveValue } from "@/lib/admin/operations-snapshot";

const QUICK_LINKS = [
  ["Country Launch Controls", "/admin/regions", "🌎"],
  ["Customer Management", "/admin/customers", "👥"],
  ["Membership Management", "/admin/memberships", "🏆"],
  ["Curriculum Manager", "/admin/curriculum", "📖"],
  ["Course Management", "/admin/courses", "📚"],
  ["Content Upload Portal", "/admin/content/upload", "📦"],
  ["Video Studio", "/admin/video-studio", "🎬"],
  ["Revenue & Profit", "/admin/profit-dashboard", "💰"],
  ["Analytics & KPIs", "/admin/kpi", "📊"],
  ["Security Center", "/admin/security-center", "🔐"],
] as const;

function money(metric: LiveValue) {
  return metric.status === "LIVE" && metric.value !== null
    ? metric.value.toLocaleString(undefined, { style: "currency", currency: "USD" })
    : "Unavailable";
}

function count(metric: LiveValue) {
  return metric.status === "LIVE" && metric.value !== null ? metric.value.toLocaleString() : "Unavailable";
}

export default function AdminDashboardClient({ snapshot }: { snapshot: ExecutiveOperationsSnapshot }) {
  const primary = [
    ["Gross Revenue", money(snapshot.grossRevenue), "Completed production payment transactions"],
    ["Net Revenue", money(snapshot.netRevenue), "Completed revenue less recorded refunds"],
    ["Active Members", count(snapshot.activeMembers), "Active production member records"],
    ["New Members · 30D", count(snapshot.newMembers30d), "Members created during the last 30 days"],
  ] as const;
  const tax = [
    ["Sales Tax Collected", money(snapshot.salesTaxCollected)], ["Sales Tax Remitted", money(snapshot.salesTaxRemitted)],
    ["Sales Tax Due", money(snapshot.salesTaxDue)], ["Total Business Tax Due", money(snapshot.totalBusinessTaxDue)],
    ["Jurisdictions With Tax Due", count(snapshot.taxJurisdictionsDue)],
  ] as const;
  return (
    <main className="min-h-screen bg-[#08101f] text-white"><div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">Administration · Live Operations</p><h1 className="mt-3 text-4xl font-black sm:text-5xl">Executive KPI Command Center</h1><p className="mt-2 max-w-3xl text-slate-400">Production-backed operating metrics. Missing sources display Unavailable instead of fabricated zero values.</p></div><div className="flex flex-wrap gap-3"><Link href="/admin/regions" className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold hover:bg-blue-600">Country Controls</Link><Link href="/admin/content/upload" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold hover:bg-emerald-600">Upload Content</Link><Link href="/admin" className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold hover:border-white">← All Modules</Link></div></div>
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{primary.map(([label,value,detail]) => <article key={label} className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-3 text-3xl font-black">{value}</p><p className="mt-3 text-xs leading-5 text-slate-500">{detail}</p></article>)}</section>
      <section className="mt-8 grid gap-6 lg:grid-cols-2"><article className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"><div className="flex items-center justify-between gap-4"><h2 className="text-xl font-bold">North America Upload Health</h2><span className={snapshot.upload.status === "READY" ? "font-bold text-emerald-400" : "font-bold text-red-400"}>{snapshot.upload.status}</span></div><div className="mt-5 space-y-2 text-sm text-slate-300"><p>Signed upload: {snapshot.upload.signedUploadConfigured ? "Configured" : "Not configured"}</p><p>Fallback path: {snapshot.upload.fallbackAvailable ? "Available" : "Unavailable"}</p><p>GitHub publication: {snapshot.upload.githubPublishingConfigured ? "Configured" : "Not configured"}</p>{snapshot.upload.problems.map((problem) => <p key={problem} className="text-red-300">• {problem}</p>)}</div><Link href="/admin/content/upload" className="mt-5 inline-block rounded-lg bg-emerald-700 px-4 py-2 font-bold hover:bg-emerald-600">Open Upload Portal →</Link></article><article className="rounded-2xl border border-white/10 bg-[#101a2f] p-6"><h2 className="text-xl font-bold">Payment Operations</h2><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-950/30 p-4"><p className="text-xs text-slate-400">Failed Payments</p><p className="mt-2 text-2xl font-black">{count(snapshot.failedPayments)}</p></div><div className="rounded-xl bg-slate-950/30 p-4"><p className="text-xs text-slate-400">Refunds</p><p className="mt-2 text-2xl font-black">{money(snapshot.refunds)}</p></div></div></article></section>
      <section className="mt-8"><div className="flex items-end justify-between gap-4"><div><h2 className="text-xl font-bold">Tax Liability</h2><p className="mt-1 text-sm text-slate-500">Reconciled from jurisdiction-level tax ledger records.</p></div><Link href="/admin/kpi" className="text-sm font-bold text-blue-400">Analytics detail →</Link></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{tax.map(([label,value]) => <div key={label} className="rounded-xl border border-white/10 bg-[#101a2f] p-5"><p className="text-xs text-slate-400">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div>)}</div></section>
      <section className="mt-8"><h2 className="text-xl font-bold">Administration Modules</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{QUICK_LINKS.map(([title,href,icon]) => <Link key={title} href={href} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#101a2f] p-5 hover:border-blue-500"><span className="text-xl">{icon}</span><span className="font-semibold">{title}</span></Link>)}</div><p className="mt-5 text-xs text-slate-500">As of {new Date(snapshot.asOf).toLocaleString()}</p></section>
    </div></main>
  );
}
