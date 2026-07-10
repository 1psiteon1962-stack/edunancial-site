import Link from "next/link";

import { getEnterpriseBIData } from "@/lib/bi/demo-data";

export default function ExecutivePage() {
  const data = getEnterpriseBIData();
  const previewMetrics = data.executiveMetrics.slice(0, 4);

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
              Executive center
            </p>
            <h1 className="mt-5 text-5xl font-black md:text-7xl">Leadership visibility at platform scale.</h1>
            <p className="mt-8 max-w-5xl text-xl leading-9 text-slate-300 md:text-2xl md:leading-10">
              Advanced dashboards, business simulations, AI-ready reporting interfaces, international
              growth visibility, and executive competency insights.
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-base font-bold text-white transition hover:bg-blue-500"
          >
            Open enterprise BI platform
          </Link>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {previewMetrics.map((metric) => (
            <div key={metric.label} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
              <p className="text-sm text-slate-400">{metric.label}</p>
              <h2 className="mt-4 text-4xl font-black">{metric.value}</h2>
              <p className="mt-3 text-sm text-slate-300">{metric.context}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-4">
          <Box title="AI-ready analytics" description="Placeholder interfaces for prediction, summaries, and anomaly detection." />
          <Box title="KPI framework" description="Reusable cards, trends, and exports for enterprise reporting." />
          <Box title="Platform health" description="Operational uptime, security, support, and deployment visibility." />
          <Box title="Executive reports" description="Daily to annual reporting packs with custom date range support." />
        </div>
      </section>
    </main>
  );
}

function Box({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-slate-300">{description}</p>
    </div>
  );
}
