import Link from "next/link";

import ExecutiveKPICard from "@/components/executive/ExecutiveKPICard";
import GeoSummaryTable from "@/components/executive/GeoSummaryTable";
import { requireOwnerPageSession } from "@/lib/admin-content/auth";
import {
  getAICoachKPIs,
  getCourseKPIs,
  getGeoData,
  getMembershipKPIs,
} from "@/lib/executive/adapters";

export const metadata = {
  title: "Analytics | Edunancial Executive",
};

export const dynamic = "force-dynamic";

export default async function ExecutiveAnalyticsPage() {
  await requireOwnerPageSession();
  const [mem, crs, ai, geo] = await Promise.all([
    getMembershipKPIs(),
    getCourseKPIs(),
    getAICoachKPIs(),
    getGeoData(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-yellow-400">
            Analytics
          </p>
          <h1 className="mt-2 text-4xl font-black">Membership & Course Analytics</h1>
        </div>
        <Link href="/executive/dashboard" className="text-sm text-slate-500 hover:text-slate-300">
          ← Dashboard
        </Link>
      </div>

      {/* Membership */}
      <section className="mt-10">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Membership</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ExecutiveKPICard label="Total Members" value={mem.total.value.toLocaleString()} status={mem.total.status} accent="border-blue-500" />
          <ExecutiveKPICard label="Active Members" value={mem.active.value.toLocaleString()} status={mem.active.status} accent="border-green-500" />
          <ExecutiveKPICard label="Inactive Members" value={mem.inactive.value.toLocaleString()} status={mem.inactive.status} accent="border-slate-600" />
          <ExecutiveKPICard label="New Today" value={mem.newToday.value.toLocaleString()} status={mem.newToday.status} accent="border-blue-500" />
          <ExecutiveKPICard label="Basic Tier" value={mem.basicTier.value.toLocaleString()} status={mem.basicTier.status} accent="border-slate-500" />
          <ExecutiveKPICard label="Pro Tier" value={mem.proTier.value.toLocaleString()} status={mem.proTier.status} accent="border-blue-500" />
          <ExecutiveKPICard label="Gold Tier" value={mem.goldTier.value.toLocaleString()} status={mem.goldTier.status} accent="border-yellow-500" />
          <ExecutiveKPICard label="Trial Members" value={mem.trial.value.toLocaleString()} status={mem.trial.status} accent="border-purple-500" />
          <ExecutiveKPICard label="Renewals" value={mem.renewals.value.toLocaleString()} status={mem.renewals.status} accent="border-green-500" />
          <ExecutiveKPICard label="Expired" value={mem.expired.value.toLocaleString()} status={mem.expired.status} accent="border-orange-500" />
          <ExecutiveKPICard label="Cancelled" value={mem.cancelled.value.toLocaleString()} status={mem.cancelled.status} accent="border-red-500" />
          <ExecutiveKPICard label="Monthly Churn" value={`${mem.monthlyChurn.value}%`} status={mem.monthlyChurn.status} accent="border-red-500" />
          <ExecutiveKPICard label="Annual Churn" value={`${mem.annualChurn.value}%`} status={mem.annualChurn.status} accent="border-red-500" />
          <ExecutiveKPICard label="Growth Rate" value={`${mem.growthRate.value}%`} status={mem.growthRate.status} accent="border-green-500" />
        </div>
      </section>

      {/* Course Analytics */}
      <section className="mt-10">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Course Analytics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ExecutiveKPICard label="Most Popular Course" value={crs.mostPopular.value} status={crs.mostPopular.status} accent="border-purple-500" />
          <ExecutiveKPICard label="Least Popular Course" value={crs.leastPopular.value} status={crs.leastPopular.status} accent="border-purple-500" />
          <ExecutiveKPICard label="Most Viewed Lesson" value={crs.mostViewedLesson.value} status={crs.mostViewedLesson.status} accent="border-purple-500" />
          <ExecutiveKPICard label="Avg Completion Rate" value={`${crs.avgCompletionRate.value}%`} status={crs.avgCompletionRate.status} accent="border-purple-500" />
          <ExecutiveKPICard label="Avg Time per Lesson" value={`${crs.avgTimePerLesson.value} min`} status={crs.avgTimePerLesson.status} accent="border-purple-500" />
          <ExecutiveKPICard label="Completions Today" value={crs.completionsToday.value.toLocaleString()} status={crs.completionsToday.status} accent="border-purple-500" />
          <ExecutiveKPICard label="Quiz Avg Score" value={`${crs.quizAvgScore.value}%`} status={crs.quizAvgScore.status} accent="border-blue-500" />
          <ExecutiveKPICard label="Certificates Issued" value={crs.certificatesIssued.value.toLocaleString()} status={crs.certificatesIssued.status} accent="border-yellow-500" />
          <ExecutiveKPICard label="Avg Course Rating" value={`${crs.avgRating.value}/5`} status={crs.avgRating.status} accent="border-yellow-500" />
        </div>
      </section>

      {/* AI Coach Analytics */}
      <section className="mt-10">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">AI Coach Analytics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ExecutiveKPICard label="Questions Asked" value={ai.questionsAsked.value.toLocaleString()} status={ai.questionsAsked.status} accent="border-cyan-500" />
          <ExecutiveKPICard label="Failed Searches" value={ai.failedSearches.value.toLocaleString()} status={ai.failedSearches.status} accent="border-red-500" />
          <ExecutiveKPICard label="Avg Response Time" value={`${ai.avgResponseTimeMs.value}ms`} status={ai.avgResponseTimeMs.status} accent="border-cyan-500" />
          <ExecutiveKPICard label="Satisfaction Rate" value={`${ai.satisfactionRate.value}%`} status={ai.satisfactionRate.status} accent="border-green-500" />
        </div>
      </section>

      {/* Geographic */}
      <section className="mt-10">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Geographic Breakdown</h2>
        <GeoSummaryTable data={geo} />
      </section>
    </main>
  );
}
