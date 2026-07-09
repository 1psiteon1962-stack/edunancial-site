"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";

// TODO: Connect to analytics API (Google Analytics, Mixpanel, or custom)

const RANGES = [
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "90d", label: "Last 90 days" },
  { key: "12m", label: "Last 12 months" },
];

function seeded(seed: number) {
  let v = seed;
  return () => {
    v = (v * 9301 + 49297) % 233280;
    return v / 233280;
  };
}

function BarChart({
  data,
  labelKey,
  color = "bg-blue-500",
}: {
  data: Array<{ label: string; value: number }>;
  labelKey?: string;
  color?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex h-40 items-end gap-2" role="img" aria-label={labelKey ?? "Bar chart"}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-32 w-full items-end overflow-hidden rounded-md bg-white/5">
            <div
              className={`w-full rounded-md ${color}`}
              style={{ height: `${Math.max((d.value / max) * 100, 4)}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-gray-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState("30d");

  const points = range === "7d" ? 7 : range === "30d" ? 10 : range === "90d" ? 12 : 12;
  const labels =
    range === "12m"
      ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      : Array.from({ length: points }, (_, i) => `${i + 1}`);

  const growthData = useMemo(() => {
    const r = seeded(range.length + points);
    return labels.map((label) => ({ label, value: Math.floor(r() * 800) + 200 }));
  }, [labels, range, points]);

  const revenueData = useMemo(() => {
    const r = seeded(range.length + points + 7);
    return labels.map((label) => ({ label, value: Math.floor(r() * 6000) + 1000 }));
  }, [labels, range, points]);

  const topCourses = [
    { title: "Financial Literacy Fundamentals", enrollments: 842, completion: 68 },
    { title: "Real Estate Investing 101", enrollments: 731, completion: 54 },
    { title: "Building Your First Business Plan", enrollments: 612, completion: 61 },
    { title: "Stock Market Essentials", enrollments: 588, completion: 47 },
    { title: "Personal Budgeting Mastery", enrollments: 540, completion: 72 },
  ];

  const funnel = [
    { label: "Visitors", value: 48291 },
    { label: "Signups", value: 6820 },
    { label: "Free Members", value: 4210 },
    { label: "Paid Members", value: 2140 },
    { label: "Active Learners", value: 1580 },
  ];
  const funnelMax = funnel[0].value;

  return (
    <div className="space-y-10">
      <PageHeader
        title="Analytics Dashboard"
        description="Membership growth, revenue trends, course performance, and engagement across Edunancial."
        actions={
          <div>
            <label htmlFor="date-range" className="sr-only">
              Date range
            </label>
            <select
              id="date-range"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#101a2f] px-4 py-2.5 text-sm font-bold text-white focus:border-blue-500 focus:outline-none"
            >
              {RANGES.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        }
      />

      <section>
        <h2 className="text-2xl font-black text-white">Membership & Growth</h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-3">
          <StatCard title="Total Members" value="12,847" change="+8.2%" changeType="up" />
          <StatCard title="Net New Members" value="284" change="+12.4%" changeType="up" />
          <StatCard title="Churn Rate" value="1.8%" change="-0.4%" changeType="up" />
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <p className="mb-4 text-sm font-bold text-gray-400">New members over time</p>
          <BarChart data={growthData} labelKey="Membership growth" color="bg-blue-500" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black text-white">Revenue</h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-3">
          <StatCard title="Subscription Revenue" value="$47,320" change="+15.3%" changeType="up" />
          <StatCard title="Avg. Revenue Per User" value="$36.80" change="+4.1%" changeType="up" />
          <StatCard title="Refund Rate" value="0.9%" change="-0.2%" changeType="up" />
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <p className="mb-4 text-sm font-bold text-gray-400">Revenue trend</p>
          <BarChart data={revenueData} labelKey="Revenue trend" color="bg-green-500" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black text-white">Course Performance</h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3 overflow-x-auto rounded-2xl border border-white/10 bg-[#101a2f]">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-gray-400">
                  <th className="px-4 py-3 font-bold">Course</th>
                  <th className="px-4 py-3 font-bold">Enrollments</th>
                  <th className="px-4 py-3 font-bold">Completion</th>
                </tr>
              </thead>
              <tbody>
                {topCourses.map((c) => (
                  <tr key={c.title} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3 font-semibold text-white">{c.title}</td>
                    <td className="px-4 py-3 text-gray-300">{c.enrollments.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-300">{c.completion}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <StatCard title="Avg. Completion Rate" value="62%" change="+3.8%" changeType="up" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black text-white">Calculator & Tool Usage</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Sessions" value="3,412" change="+31.2%" changeType="up" />
          <StatCard title="Budget Calculator" value="1,504" />
          <StatCard title="Net Worth Tracker" value="982" />
          <StatCard title="Investment Calculator" value="926" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black text-white">User Engagement</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          <StatCard title="Avg. Session Time" value="6m 42s" change="+5.6%" changeType="up" />
          <StatCard title="Pages / Session" value="4.3" change="+2.1%" changeType="up" />
          <StatCard title="Bounce Rate" value="38.2%" change="-3.4%" changeType="up" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black text-white">Conversion Funnel</h2>
        <div className="mt-4 rounded-2xl border border-white/10 bg-[#101a2f] p-6">
          <div className="space-y-3">
            {funnel.map((stage, i) => (
              <div key={stage.label}>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-white">{stage.label}</span>
                  <span className="text-gray-400">
                    {stage.value.toLocaleString()}
                    {i > 0 && (
                      <span className="ml-2 text-xs text-gray-500">
                        ({((stage.value / funnel[i - 1].value) * 100).toFixed(1)}% of previous)
                      </span>
                    )}
                  </span>
                </div>
                <div className="mt-1 h-4 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${(stage.value / funnelMax) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
