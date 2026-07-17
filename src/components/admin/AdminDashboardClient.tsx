"use client";

import Link from "next/link";

const METRICS = [
  { label: "Total Members", value: "0", trend: null, color: "border-blue-500" },
  { label: "Active Subscriptions", value: "0", trend: null, color: "border-green-500" },
  { label: "Monthly Revenue", value: "$0.00", trend: null, color: "border-yellow-500" },
  { label: "Annual Revenue", value: "$0.00", trend: null, color: "border-yellow-500" },
  { label: "Courses Sold", value: "0", trend: null, color: "border-purple-500" },
  { label: "Assessments Completed", value: "0", trend: null, color: "border-blue-500" },
  { label: "Countries Served", value: "0", trend: null, color: "border-green-500" },
  { label: "Avg Competency Score", value: "—", trend: null, color: "border-red-500" },
];

const QUICK_LINKS = [
  { title: "Customer Management", href: "/admin/customers", icon: "👥" },
  { title: "Membership Management", href: "/admin/memberships", icon: "🏆" },
  { title: "Course Management", href: "/admin/courses", icon: "📚" },
  { title: "Course Import", href: "/admin/courses/import", icon: "⬆️" },
  { title: "Media Library", href: "/admin/media", icon: "🗂️" },
  { title: "Content Upload Portal", href: "/admin/content", icon: "📦" },
  { title: "Revenue & Profit", href: "/admin/profit-dashboard", icon: "💰" },
  { title: "Email Campaigns", href: "/admin/email-campaigns", icon: "📧" },
  { title: "Beta Testers", href: "/admin/beta-testers", icon: "🧪" },
  { title: "Analytics & KPIs", href: "/admin/kpi", icon: "📊" },
  { title: "Security Center", href: "/admin/security-center", icon: "🔐" },
  { title: "Settings", href: "/admin/settings", icon: "⚙️" },
];

const RECENT_ACTIVITY = [
  { action: "Platform initialized", time: "Just now", type: "system" },
  { action: "Admin dashboard connected", time: "Just now", type: "system" },
];

export default function AdminDashboardClient() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-yellow-400">
              Administration
            </p>
            <h1 className="mt-3 text-5xl font-black">Executive Dashboard</h1>
            <p className="mt-2 text-slate-400">
              Global Administration Console · Edunancial Platform
            </p>
          </div>
          <Link
            href="/admin"
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold hover:border-white"
          >
            ← All Modules
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map(({ label, value, color }) => (
            <div key={label} className={`rounded-2xl border-l-4 ${color} bg-[#101a2f] p-7`}>
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-4xl font-black">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-8">
            <h2 className="text-xl font-bold">Revenue Over Time</h2>
            <p className="mt-2 text-sm text-slate-500">
              Connect your payment provider to see revenue trends.
            </p>
            <div className="mt-6 flex h-40 items-center justify-center rounded-xl bg-slate-800/40">
              <p className="text-sm text-slate-500">Chart · Awaiting data</p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-8">
            <h2 className="text-xl font-bold">Member Growth</h2>
            <p className="mt-2 text-sm text-slate-500">
              Member registrations by month will appear here.
            </p>
            <div className="mt-6 flex h-40 items-center justify-center rounded-xl bg-slate-800/40">
              <p className="text-sm text-slate-500">Chart · Awaiting data</p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold">Administration Modules</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_LINKS.map(({ title, href, icon }) => (
              <Link
                key={title}
                href={href}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#101a2f] p-6 transition hover:border-blue-500"
              >
                <span className="text-2xl">{icon}</span>
                <span className="font-semibold">{title}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-[#101a2f] p-8">
          <h2 className="text-xl font-bold">Recent Activity</h2>
          <div className="mt-5 space-y-3">
            {RECENT_ACTIVITY.map(({ action, time, type }) => (
              <div
                key={action}
                className="flex items-center justify-between rounded-lg bg-slate-800/40 px-5 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-green-400"></span>
                  <span className="text-sm">{action}</span>
                  {type === "system" && (
                    <span className="rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-400">
                      System
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
