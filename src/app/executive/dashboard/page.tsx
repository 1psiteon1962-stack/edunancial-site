import Link from "next/link";

import ExecutiveKPICard from "@/components/executive/ExecutiveKPICard";
import GeoSummaryTable from "@/components/executive/GeoSummaryTable";
import SystemHealthCard from "@/components/executive/SystemHealthCard";
import { requireOwnerPageSession } from "@/lib/admin-content/auth";
import { getExecutiveSnapshot } from "@/lib/executive/adapters";
import type { DataStatus } from "@/lib/executive/types";

export const metadata = { title: "Executive Dashboard | Edunancial" };
export const dynamic = "force-dynamic";

type FrameworkMetric = {
  label: string;
  value?: string;
  status?: DataStatus;
  sublabel?: string;
  accent?: string;
};

function FrameworkSection({
  title,
  description,
  metrics,
}: {
  title: string;
  description?: string;
  metrics: FrameworkMetric[];
}) {
  return (
    <section className="mt-10">
      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</h2>
        {description ? <p className="mt-1 max-w-4xl text-sm text-slate-500">{description}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <ExecutiveKPICard
            key={`${title}-${metric.label}`}
            label={metric.label}
            value={metric.value ?? "—"}
            status={metric.status ?? "pending"}
            sublabel={metric.sublabel}
            accent={metric.accent ?? "border-slate-700"}
          />
        ))}
      </div>
    </section>
  );
}

export default async function ExecutiveDashboardPage() {
  await requireOwnerPageSession();
  const snap = await getExecutiveSnapshot();
  const {
    revenue: rev,
    membership: mem,
    courses: crs,
    system: sys,
    marketing: mkt,
    financial: fin,
    ai,
    goals,
  } = snap;

  const ltvCacStatus: DataStatus = rev.ltv.status === "live" && mkt.cac.status === "live" ? "live" : "pending";
  const ltvCac = ltvCacStatus === "live" && mkt.cac.value > 0 ? `${(rev.ltv.value / mkt.cac.value).toFixed(2)}x` : "—";

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-yellow-400">Executive Command Center</p>
          <h1 className="mt-2 text-4xl font-black">Do I Know My Numbers?</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">
            Edunancial management cockpit. Live metrics are shown only when a verified source is connected; everything else remains visibly pending until the underlying data is trustworthy.
          </p>
          <p className="mt-1 text-xs text-slate-500">Last updated: {new Date(snap.generatedAt).toLocaleString()}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/executive/kpi/export" className="rounded-lg border border-yellow-500/40 px-4 py-2 text-sm font-semibold text-yellow-400 hover:bg-yellow-500/10">↓ Export CSV</Link>
          <Link href="/executive/kpi" className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-yellow-400">Goals & Targets →</Link>
        </div>
      </div>

      <FrameworkSection
        title="CEO Snapshot"
        description="The 30-second view: growth, customer economics, cash and operating health."
        metrics={[
          { label: "Revenue Today", value: `$${rev.today.value.toLocaleString()}`, status: rev.today.status, accent: "border-yellow-500" },
          { label: "MRR", value: `$${rev.mrr.value.toLocaleString()}`, status: rev.mrr.status, accent: "border-green-500" },
          { label: "ARR", value: `$${rev.arr.value.toLocaleString()}`, status: rev.arr.status, accent: "border-green-500" },
          { label: "Active Paying Members", value: mem.active.value.toLocaleString(), status: mem.active.status, accent: "border-blue-500" },
          { label: "CAC", value: `$${mkt.cac.value.toFixed(2)}`, status: mkt.cac.status, accent: "border-yellow-500" },
          { label: "LTV", value: `$${rev.ltv.value.toFixed(2)}`, status: rev.ltv.status, accent: "border-blue-500" },
          { label: "LTV:CAC", value: ltvCac, status: ltvCacStatus, accent: "border-purple-500", sublabel: "Calculated only when both LTV and CAC are live" },
          { label: "Monthly Churn", value: `${mem.monthlyChurn.value}%`, status: mem.monthlyChurn.status, accent: "border-red-500" },
          { label: "Gross Margin", value: `${fin.grossMargin.value}%`, status: fin.grossMargin.status, accent: "border-green-500" },
          { label: "Cash Position", value: `$${fin.cashPosition.value.toLocaleString()}`, status: fin.cashPosition.status, accent: "border-green-500" },
          { label: "Monthly Burn", value: `$${fin.monthlyBurnRate.value.toLocaleString()}`, status: fin.monthlyBurnRate.status, accent: "border-red-500" },
          { label: "Runway", sublabel: "Months of cash remaining at current burn", accent: "border-red-500" },
        ]}
      />

      <FrameworkSection
        title="Acquisition & Growth — Month to Date"
        description="Tracks the full acquisition funnel and the economics of each channel."
        metrics={[
          { label: "Visitors", value: mkt.visitors.value.toLocaleString(), status: mkt.visitors.status, accent: "border-cyan-500" },
          { label: "Leads", sublabel: "Captured lead/contact intent", accent: "border-cyan-500" },
          { label: "Signups", value: mkt.membershipSignups.value.toLocaleString(), status: mkt.membershipSignups.status, accent: "border-cyan-500" },
          { label: "Activated Users", sublabel: "Users who reach the defined first-value milestone", accent: "border-blue-500" },
          { label: "Trial Starts", accent: "border-blue-500" },
          { label: "Customers", value: mkt.conversions.value.toLocaleString(), status: mkt.conversions.status, accent: "border-green-500" },
          { label: "CAC", value: `$${mkt.cac.value.toFixed(2)}`, status: mkt.cac.status, accent: "border-yellow-500" },
          { label: "CPA / Signup", value: `$${mkt.cpa.value.toFixed(2)}`, status: mkt.cpa.status, accent: "border-yellow-500" },
          { label: "ROAS", value: `${mkt.roas.value.toFixed(2)}x`, status: mkt.roas.status, accent: "border-purple-500" },
          { label: "Organic Visits", value: mkt.organicSearch.value.toLocaleString(), status: mkt.organicSearch.status, accent: "border-green-500" },
          { label: "Referral Visits", value: mkt.referralTraffic.value.toLocaleString(), status: mkt.referralTraffic.status, accent: "border-blue-500" },
          { label: "Social Visits", value: mkt.socialTraffic.value.toLocaleString(), status: mkt.socialTraffic.status, accent: "border-cyan-500" },
        ]}
      />

      <FrameworkSection
        title="Customer Economics"
        description="Unit economics required to determine whether growth creates or destroys enterprise value."
        metrics={[
          { label: "CAC", value: `$${mkt.cac.value.toFixed(2)}`, status: mkt.cac.status, accent: "border-yellow-500" },
          { label: "LTV", value: `$${rev.ltv.value.toFixed(2)}`, status: rev.ltv.status, accent: "border-blue-500" },
          { label: "LTV:CAC", value: ltvCac, status: ltvCacStatus, accent: "border-purple-500" },
          { label: "CAC Payback Period", sublabel: "Months to recover acquisition cost from gross profit", accent: "border-purple-500" },
          { label: "ARPU", value: `$${rev.arpu.value.toFixed(2)}`, status: rev.arpu.status, accent: "border-blue-500" },
          { label: "ARPPU", sublabel: "Average revenue per paying user", accent: "border-blue-500" },
          { label: "Average Transaction Value", accent: "border-green-500" },
          { label: "Gross Profit / Customer", accent: "border-green-500" },
          { label: "Contribution Margin / Customer", accent: "border-green-500" },
          { label: "Revenue / Customer Cohort", sublabel: "Tracked over time by acquisition month", accent: "border-cyan-500" },
        ]}
      />

      <FrameworkSection
        title="Revenue Engine"
        description="Shows not only how much revenue exists, but why recurring revenue changed."
        metrics={[
          { label: "Today", value: `$${rev.today.value.toLocaleString()}`, status: rev.today.status, accent: "border-yellow-500" },
          { label: "Yesterday", value: `$${rev.yesterday.value.toLocaleString()}`, status: rev.yesterday.status, accent: "border-yellow-500" },
          { label: "Week to Date", value: `$${rev.weekToDate.value.toLocaleString()}`, status: rev.weekToDate.status, accent: "border-yellow-500" },
          { label: "Month to Date", value: `$${rev.monthToDate.value.toLocaleString()}`, status: rev.monthToDate.status, accent: "border-yellow-500" },
          { label: "Quarter to Date", accent: "border-yellow-500" },
          { label: "Year to Date", value: `$${rev.yearToDate.value.toLocaleString()}`, status: rev.yearToDate.status, accent: "border-yellow-500" },
          { label: "New MRR", accent: "border-green-500" },
          { label: "Expansion MRR", accent: "border-green-500" },
          { label: "Contraction MRR", accent: "border-red-500" },
          { label: "Churned MRR", accent: "border-red-500" },
          { label: "Net New MRR", accent: "border-green-500" },
          { label: "Refunds", value: `$${rev.refunds.value.toLocaleString()}`, status: rev.refunds.status, accent: "border-red-500" },
        ]}
      />

      <FrameworkSection
        title="Retention & Cohorts"
        description="Separates customer growth from customer durability and supports cohort-based LTV."
        metrics={[
          { label: "Monthly Customer Churn", value: `${mem.monthlyChurn.value}%`, status: mem.monthlyChurn.status, accent: "border-red-500" },
          { label: "Annual Customer Churn", value: `${mem.annualChurn.value}%`, status: mem.annualChurn.status, accent: "border-red-500" },
          { label: "Month-1 Retention", accent: "border-green-500" },
          { label: "Month-3 Retention", accent: "border-green-500" },
          { label: "Month-6 Retention", accent: "border-green-500" },
          { label: "Month-12 Retention", accent: "border-green-500" },
          { label: "Best Retention Channel", sublabel: "Acquisition source with strongest cohort retention", accent: "border-blue-500" },
          { label: "Best Retention Product", accent: "border-blue-500" },
        ]}
      />

      <FrameworkSection
        title="Product Engagement & Activation"
        description="Measures whether users actually receive value, return, learn and adopt core products."
        metrics={[
          { label: "Daily Active Users", accent: "border-cyan-500" },
          { label: "Weekly Active Users", accent: "border-cyan-500" },
          { label: "Monthly Active Users", accent: "border-cyan-500" },
          { label: "DAU / MAU", sublabel: "Engagement / stickiness ratio", accent: "border-cyan-500" },
          { label: "Activation Rate", sublabel: "Defined first-value milestone completion", accent: "border-green-500" },
          { label: "Sessions / Customer", accent: "border-blue-500" },
          { label: "Avg Time on Platform", accent: "border-blue-500" },
          { label: "Course Completions Today", value: crs.completionsToday.value.toLocaleString(), status: crs.completionsToday.status, accent: "border-purple-500" },
          { label: "Avg Course Completion", value: `${crs.avgCompletionRate.value}%`, status: crs.avgCompletionRate.status, accent: "border-purple-500" },
          { label: "Quiz Avg Score", value: `${crs.quizAvgScore.value}%`, status: crs.quizAvgScore.status, accent: "border-purple-500" },
          { label: "Certificates Issued", value: crs.certificatesIssued.value.toLocaleString(), status: crs.certificatesIssued.status, accent: "border-purple-500" },
          { label: "Feature Adoption", sublabel: "Use of core tools/products by active users", accent: "border-green-500" },
        ]}
      />

      <FrameworkSection
        title="Financial Management"
        description="CFO view of profitability, liquidity, spending discipline and runway."
        metrics={[
          { label: "Revenue", value: `$${fin.revenue.value.toLocaleString()}`, status: fin.revenue.status, accent: "border-yellow-500" },
          { label: "COGS", sublabel: "Direct cost to deliver products/services", accent: "border-red-500" },
          { label: "Gross Profit", value: `$${fin.grossProfit.value.toLocaleString()}`, status: fin.grossProfit.status, accent: "border-green-500" },
          { label: "Gross Margin", value: `${fin.grossMargin.value}%`, status: fin.grossMargin.status, accent: "border-green-500" },
          { label: "Operating Expenses", value: `$${fin.expenses.value.toLocaleString()}`, status: fin.expenses.status, accent: "border-red-500" },
          { label: "Net Income", value: `$${fin.netProfit.value.toLocaleString()}`, status: fin.netProfit.status, accent: "border-green-500" },
          { label: "Operating Margin", value: `${fin.operatingMargin.value}%`, status: fin.operatingMargin.status, accent: "border-green-500" },
          { label: "Cash Position", value: `$${fin.cashPosition.value.toLocaleString()}`, status: fin.cashPosition.status, accent: "border-green-500" },
          { label: "Accounts Receivable", accent: "border-blue-500" },
          { label: "Accounts Payable", accent: "border-yellow-500" },
          { label: "Monthly Burn", value: `$${fin.monthlyBurnRate.value.toLocaleString()}`, status: fin.monthlyBurnRate.status, accent: "border-red-500" },
          { label: "Runway", sublabel: "Months at current net burn", accent: "border-red-500" },
          { label: "Budget vs Actual", sublabel: "Current period variance", accent: "border-purple-500" },
        ]}
      />

      <FrameworkSection
        title="AI Economics & Quality"
        description="Tracks AI utility, cost, quality and its effect on gross margin."
        metrics={[
          { label: "AI Conversations", value: ai.questionsAsked.value.toLocaleString(), status: ai.questionsAsked.status, accent: "border-cyan-500" },
          { label: "AI Cost / Conversation", accent: "border-yellow-500" },
          { label: "AI Cost / Active Member", accent: "border-yellow-500" },
          { label: "AI Cost % of Revenue", accent: "border-yellow-500" },
          { label: "Token / API Spend", accent: "border-yellow-500" },
          { label: "Avg Response Time", value: `${ai.avgResponseTimeMs.value} ms`, status: ai.avgResponseTimeMs.status, accent: "border-blue-500" },
          { label: "Failed AI Requests", value: ai.failedSearches.value.toLocaleString(), status: ai.failedSearches.status, accent: "border-red-500" },
          { label: "AI Satisfaction", value: `${ai.satisfactionRate.value}%`, status: ai.satisfactionRate.status, accent: "border-green-500" },
          { label: "Top AI Topics", value: ai.topTopics.value.slice(0, 3).join(", ") || "—", status: ai.topTopics.status, accent: "border-purple-500" },
          { label: "Top AI Languages", value: ai.topLanguages.value.slice(0, 3).join(", ") || "—", status: ai.topLanguages.status, accent: "border-purple-500" },
        ]}
      />

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Geographic Intelligence</h2>
            <p className="mt-1 text-sm text-slate-500">Country/market view for traffic, members, revenue, engagement and future CAC/LTV comparisons.</p>
          </div>
          <Link href="/executive/analytics" className="text-xs text-slate-500 hover:text-slate-300">Full analytics →</Link>
        </div>
        <GeoSummaryTable data={snap.geo} />
      </section>

      <FrameworkSection
        title="Product-Level Profitability"
        description="Determines which Edunancial products deserve additional capital and which require redesign."
        metrics={[
          { label: "Membership Revenue / Margin", accent: "border-green-500" },
          { label: "Course Revenue / Margin", accent: "border-green-500" },
          { label: "AI Revenue Attribution / Margin", accent: "border-cyan-500" },
          { label: "EduVesting Revenue / Margin", accent: "border-purple-500" },
          { label: "Other Product Revenue / Margin", accent: "border-blue-500" },
          { label: "Highest-Margin Product", accent: "border-green-500" },
          { label: "Lowest-Margin Product", accent: "border-red-500" },
        ]}
      />

      <FrameworkSection
        title="Marketing Attribution"
        description="Closes the loop from marketing dollar to customer to lifetime value."
        metrics={[
          { label: "First-Touch Source", accent: "border-cyan-500" },
          { label: "Last-Touch Source", accent: "border-cyan-500" },
          { label: "Top Campaign by Customers", accent: "border-green-500" },
          { label: "Top Campaign by Revenue", accent: "border-green-500" },
          { label: "Revenue by Acquisition Source", accent: "border-purple-500" },
          { label: "LTV by Acquisition Source", accent: "border-purple-500" },
          { label: "CAC by Acquisition Source", accent: "border-yellow-500" },
          { label: "Unattributed Traffic %", sublabel: "Data-quality indicator", accent: "border-red-500" },
        ]}
      />

      <FrameworkSection
        title="Investor Readiness"
        description="Permanent organizational readiness score: the company should be capable of accepting capital even when it chooses not to."
        metrics={[
          { label: "Overall Investor Readiness", sublabel: "Weighted score, objective evidence only", accent: "border-yellow-500" },
          { label: "Corporate / Governance", accent: "border-blue-500" },
          { label: "Financial Reporting", accent: "border-green-500" },
          { label: "Traction", accent: "border-cyan-500" },
          { label: "Unit Economics", accent: "border-purple-500" },
          { label: "Product", accent: "border-blue-500" },
          { label: "Technology", accent: "border-blue-500" },
          { label: "Market Validation", accent: "border-cyan-500" },
          { label: "IP / Legal", accent: "border-yellow-500" },
          { label: "Data Room", accent: "border-yellow-500" },
          { label: "Team", accent: "border-green-500" },
          { label: "Blocking Issues", sublabel: "Items that would prevent or delay diligence/closing", accent: "border-red-500" },
        ]}
      />

      <FrameworkSection
        title="Goals vs Actual"
        description="Owner targets should always be compared with actual performance and variance."
        metrics={[
          { label: goals.revenueGoal.label, value: `$${goals.revenueGoal.current.toLocaleString()} / $${goals.revenueGoal.target.toLocaleString()}`, sublabel: "Actual / target", accent: "border-yellow-500" },
          { label: goals.membershipGoal.label, value: `${goals.membershipGoal.current.toLocaleString()} / ${goals.membershipGoal.target.toLocaleString()}`, sublabel: "Actual / target", accent: "border-blue-500" },
          { label: goals.trafficGoal.label, value: `${goals.trafficGoal.current.toLocaleString()} / ${goals.trafficGoal.target.toLocaleString()}`, sublabel: "Actual / target", accent: "border-cyan-500" },
          { label: goals.courseCompletionGoal.label, value: `${goals.courseCompletionGoal.current.toLocaleString()} / ${goals.courseCompletionGoal.target.toLocaleString()}`, sublabel: "Actual / target", accent: "border-purple-500" },
          { label: goals.customerSatisfactionGoal.label, value: `${goals.customerSatisfactionGoal.current}% / ${goals.customerSatisfactionGoal.target}%`, sublabel: "Actual / target", accent: "border-green-500" },
          { label: goals.monthlyGrowthGoal.label, value: `${goals.monthlyGrowthGoal.current}% / ${goals.monthlyGrowthGoal.target}%`, sublabel: "Actual / target", accent: "border-green-500" },
          { label: goals.netProfitGoal.label, value: `$${goals.netProfitGoal.current.toLocaleString()} / $${goals.netProfitGoal.target.toLocaleString()}`, sublabel: "Actual / target", accent: "border-green-500" },
          { label: "Variance & Trend", sublabel: "Favorable/unfavorable variance plus direction", accent: "border-purple-500" },
        ]}
      />

      <FrameworkSection
        title="Alerts & Exceptions"
        description="Management-by-exception: surface material changes automatically instead of requiring constant dashboard watching."
        metrics={[
          { label: "CAC Spike Alert", sublabel: "Threshold-based acquisition-cost warning", accent: "border-red-500" },
          { label: "Conversion Drop Alert", accent: "border-red-500" },
          { label: "Churn Threshold Alert", accent: "border-red-500" },
          { label: "Revenue Drop Alert", accent: "border-red-500" },
          { label: "AI Cost Spike Alert", accent: "border-red-500" },
          { label: "Payment Failure Alert", accent: "border-red-500" },
          { label: "Refund Spike Alert", accent: "border-red-500" },
          { label: "Runway Threshold Alert", accent: "border-red-500" },
        ]}
      />

      <FrameworkSection
        title="Data Integrity & Reconciliation"
        description="A management number is useful only if its source, freshness and reconciliation status are known."
        metrics={[
          { label: "Last Data Refresh", value: new Date(snap.generatedAt).toLocaleString(), status: "live", accent: "border-green-500" },
          { label: "Live Data Sources", sublabel: "Connected and passing validation", accent: "border-green-500" },
          { label: "Pending Integrations", sublabel: "Metrics awaiting source-of-truth connection", accent: "border-yellow-500" },
          { label: "Tracking Failure Rate", accent: "border-red-500" },
          { label: "Duplicate Event Rate", accent: "border-red-500" },
          { label: "Unattributed Traffic %", accent: "border-yellow-500" },
          { label: "Payment Reconciliation", sublabel: "Dashboard revenue vs payment provider", accent: "border-green-500" },
          { label: "Accounting Reconciliation", sublabel: "Dashboard totals vs accounting source", accent: "border-green-500" },
        ]}
      />

      <section className="mt-10">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">System Health</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SystemHealthCard name={sys.application.name} status={sys.application.status} latencyMs={sys.application.latencyMs} />
          <SystemHealthCard name={sys.database.name} status={sys.database.status} latencyMs={sys.database.latencyMs} />
          <SystemHealthCard name={sys.supabase.name} status={sys.supabase.status} latencyMs={sys.supabase.latencyMs} />
          <SystemHealthCard name={sys.netlify.name} status={sys.netlify.status} latencyMs={sys.netlify.latencyMs} />
        </div>
      </section>
    </main>
  );
}
