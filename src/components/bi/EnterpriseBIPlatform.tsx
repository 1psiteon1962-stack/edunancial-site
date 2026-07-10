import Link from "next/link";

import { EXPORT_FORMAT_OPTIONS, REPORT_PERIOD_OPTIONS } from "@/lib/bi/demo-data";
import type { CoursePerformance, EnterpriseBIData, KpiMetric, ReportPeriod } from "@/lib/bi/types";
import {
  BarChart,
  EventsTable,
  FunnelChart,
  GeoPlaceholder,
  HeatMapPlaceholder,
  LineChart,
  PieChart,
  TrendBadge,
} from "@/components/bi/BIVisuals";

function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="rounded-[2rem] border border-white/10 bg-[#0b1325] p-6 shadow-2xl shadow-black/20 md:p-8">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">{title}</h2>
        </div>
        <p className="max-w-3xl text-sm leading-7 text-slate-300 md:text-base">{description}</p>
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function KpiCard({ metric }: { metric: KpiMetric }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-[#10192e] p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-slate-300">{metric.label}</p>
        <TrendBadge direction={metric.direction} delta={metric.delta} />
      </div>
      <p className="mt-5 text-3xl font-black text-white md:text-4xl">{metric.value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-400">{metric.context}</p>
    </article>
  );
}

function MetricGrid({ metrics }: { metrics: KpiMetric[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {metrics.map((metric) => (
        <KpiCard key={metric.label} metric={metric} />
      ))}
    </div>
  );
}

function CourseTable({
  title,
  items,
}: {
  title: string;
  items: CoursePerformance[];
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#10192e]">
      <div className="border-b border-white/10 px-6 py-5">
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-900/70 text-slate-300">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">Course</th>
              <th scope="col" className="px-6 py-4 font-semibold">Enrollments</th>
              <th scope="col" className="px-6 py-4 font-semibold">Completion</th>
              <th scope="col" className="px-6 py-4 font-semibold">Quiz score</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.course} className="border-t border-white/5 text-slate-200">
                <td className="px-6 py-4">{item.course}</td>
                <td className="px-6 py-4">{item.enrollments.toLocaleString()}</td>
                <td className="px-6 py-4">{item.completionRate}</td>
                <td className="px-6 py-4">{item.avgQuizScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ReportBuilder({
  activePeriod,
  data,
  startDate,
  endDate,
}: {
  activePeriod: ReportPeriod;
  data: EnterpriseBIData;
  startDate?: string;
  endDate?: string;
}) {
  const buildExportHref = (format: string) => {
    const params = new URLSearchParams();
    params.set("format", format);
    params.set("period", activePeriod);

    if (startDate) {
      params.set("startDate", startDate);
    }

    if (endDate) {
      params.set("endDate", endDate);
    }

    return `/admin/dashboard/export?${params.toString()}`;
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <section className="rounded-3xl border border-white/10 bg-[#10192e] p-6">
        <form action="/admin/dashboard" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-sm font-medium text-slate-200">
            Report cadence
            <select
              name="period"
              defaultValue={activePeriod}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            >
              {REPORT_PERIOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-slate-200">
            Start date
            <input
              type="date"
              name="startDate"
              defaultValue={startDate}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            />
          </label>

          <label className="text-sm font-medium text-slate-200">
            End date
            <input
              type="date"
              name="endDate"
              defaultValue={endDate}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            />
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
            >
              Generate report view
            </button>
          </div>
        </form>

        <div className="mt-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm text-cyan-100">
          Current report window: <strong>{data.range.label}</strong>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {EXPORT_FORMAT_OPTIONS.map((option) => (
            <Link
              key={option.value}
              href={buildExportHref(option.value)}
              className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 text-center text-sm font-semibold text-white transition hover:border-blue-400"
            >
              Export {option.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#10192e] p-6">
        <h3 className="text-lg font-bold text-white">Report packs</h3>
        <div className="mt-5 space-y-4">
          {data.reportPacks.map((pack) => (
            <article key={pack.title} className="rounded-2xl bg-slate-900/70 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-white">{pack.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{pack.description}</p>
                </div>
                <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-200">
                  {pack.cadence}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-300">Audience: {pack.audience}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function EnterpriseBIPlatform({
  data,
  activePeriod,
  startDate,
  endDate,
}: {
  data: EnterpriseBIData;
  activePeriod: ReportPeriod;
  startDate?: string;
  endDate?: string;
}) {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.25),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(34,211,238,0.15),_transparent_28%)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="flex flex-col gap-10 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
                Enterprise reporting and intelligence
              </p>
              <h1 className="mt-5 text-4xl font-black text-white md:text-6xl">
                Executive, learning, marketing, financial, and operational analytics in one platform.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                Demo-ready dashboards deliver actionable insights today while preserving compatibility
                with future data warehouses, Power BI, Tableau, and AI-driven reporting services.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:w-[28rem]">
              {data.integrations.map((integration) => (
                <article
                  key={integration.name}
                  className="rounded-3xl border border-white/10 bg-[#10192e] p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                    {integration.status}
                  </p>
                  <h2 className="mt-3 text-lg font-bold text-white">{integration.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{integration.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-white/10 px-4 py-2">Generated {data.generatedAt}</span>
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2">
              Scope: {data.range.label}
            </span>
            <span className="rounded-full border border-white/10 px-4 py-2">WCAG 2.2 AA-minded UI</span>
            <span className="rounded-full border border-white/10 px-4 py-2">Millions-of-users ready architecture</span>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:py-14">
        <SectionShell
          id="executive"
          eyebrow="Executive dashboard"
          title="North-star company performance"
          description="Top-line member, revenue, retention, and growth KPIs for leadership visibility."
        >
          <MetricGrid metrics={data.executiveMetrics} />
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <LineChart
              title="MRR growth trend"
              series={data.executiveRevenueTrend}
              unit="Monthly recurring revenue in millions of USD"
            />
            <PieChart title="Conversion source mix" segments={data.executiveConversionMix} />
          </div>
        </SectionShell>

        <SectionShell
          id="learning"
          eyebrow="Learning analytics"
          title="Learner engagement and course health"
          description="Enrollment, completion, quiz, certificate, and learning-hour signals for instructors and admins."
        >
          <MetricGrid metrics={data.learningMetrics} />
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <LineChart
              title="Learning hours trend"
              series={data.learningHoursTrend}
              unit="Weekly learning hours in thousands"
            />
            <BarChart
              title="Popular course enrollments"
              unit="Enrollment volume by top course"
              series={data.learningCourseRankings.map((course) => ({
                label: course.course,
                value: course.enrollments,
              }))}
            />
            <CourseTable title="Most popular courses" items={data.learningCourseRankings} />
            <CourseTable title="Least completed courses" items={data.leastCompletedCourses} />
          </div>
        </SectionShell>

        <SectionShell
          id="financial"
          eyebrow="Financial analytics"
          title="Revenue, billing, and forecast monitoring"
          description="Finance-ready snapshots for payment health, subscriptions, plan movement, and forecasting."
        >
          <MetricGrid metrics={data.financialMetrics} />
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <LineChart
              title="Revenue forecast outlook"
              series={data.financialRevenueForecast}
              unit="Revenue forecast in millions of USD"
            />
            <PieChart title="Payment method mix" segments={data.financialPaymentMix} />
          </div>
        </SectionShell>

        <SectionShell
          id="marketing"
          eyebrow="Marketing reporting"
          title="Traffic, funnel, and campaign performance"
          description="Growth-team reporting for search, AI referrals, lifecycle campaigns, landing pages, and ROI."
        >
          <MetricGrid metrics={data.marketingMetrics} />
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <LineChart
              title="Traffic growth trend"
              series={data.marketingTrafficTrend}
              unit="Monthly sessions in millions"
            />
            <PieChart title="Referral source mix" segments={data.marketingReferralMix} />
            <div className="xl:col-span-2">
              <FunnelChart title="Member acquisition funnel" steps={data.marketingFunnel} />
            </div>
          </div>
        </SectionShell>

        <SectionShell
          id="operations"
          eyebrow="Operational analytics"
          title="Platform health and delivery readiness"
          description="Operational visibility for uptime, API quality, incidents, support, security, backups, and release health."
        >
          <MetricGrid metrics={data.operationalMetrics} />
          <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <BarChart
              title="API latency by service"
              unit="Median response time in milliseconds"
              series={data.operationalApiLatency}
            />
            <EventsTable title="Deployment and operations history" events={data.operationalEvents} />
          </div>
        </SectionShell>

        <SectionShell
          id="report-builder"
          eyebrow="Report builder"
          title="Scheduled and custom report generation"
          description="Admins can generate daily, weekly, monthly, quarterly, annual, or custom-range reports and export them to PDF, CSV, or Excel."
        >
          <ReportBuilder
            activePeriod={activePeriod}
            data={data}
            startDate={startDate}
            endDate={endDate}
          />
        </SectionShell>

        <SectionShell
          id="visualization-framework"
          eyebrow="Visualization framework"
          title="Reusable reporting components"
          description="Standardized visualization patterns are ready for dashboard reuse, future data-warehouse feeds, and embedded BI adapters."
        >
          <div className="grid gap-6 xl:grid-cols-2">
            <HeatMapPlaceholder />
            <GeoPlaceholder />
          </div>
        </SectionShell>

        <SectionShell
          id="ai-analytics"
          eyebrow="AI-ready interfaces"
          title="Future analytics service contracts"
          description="Placeholder interfaces are prepared for predictive analytics, executive summaries, recommendations, and anomaly detection without enabling live AI features yet."
        >
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {data.aiInterfaces.map((item) => (
              <article key={item.name} className="rounded-3xl border border-white/10 bg-[#10192e] p-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-bold text-white">{item.name}</h3>
                  <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-200">
                    {item.status}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-400">{item.description}</p>
                <p className="mt-4 text-sm font-medium text-slate-200">Planned output: {item.output}</p>
              </article>
            ))}
          </div>
        </SectionShell>
      </div>
    </main>
  );
}
