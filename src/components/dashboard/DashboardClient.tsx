"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";

const TIER_LABELS: Record<string, string> = {
  free: "Free Member",
  basic: "Basic Member",
  premium: "Premium Member",
  enterprise: "Enterprise Member",
};

const TIER_COLORS: Record<string, string> = {
  free: "text-slate-400",
  basic: "text-blue-400",
  premium: "text-yellow-400",
  enterprise: "text-purple-400",
};

function StatCard({
  label,
  value,
  bg,
}: {
  label: string;
  value: string | number;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-2xl p-8 text-center`}>
      <p className="text-sm font-semibold uppercase tracking-wider opacity-80">{label}</p>
      <p className="mt-4 text-5xl font-black">{value}</p>
    </div>
  );
}

export default function DashboardClient() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">Loading…</p>
      </main>
    );
  }

  const overallScore = user.overallScore ?? 0;
  const hasAssessment = user.assessmentCompleted && overallScore > 0;

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-16">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
              Member Dashboard
            </p>
            <h1 className="mt-4 text-5xl font-black">
              Welcome back, {user.firstName}
            </h1>
            <p className={`mt-2 text-lg font-semibold ${TIER_COLORS[user.membershipTier] ?? "text-slate-400"}`}>
              {TIER_LABELS[user.membershipTier] ?? user.membershipTier}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/member/profile"
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold hover:border-white"
            >
              My Profile
            </Link>
            <Link
              href="/assessment"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold hover:bg-blue-700"
            >
              {hasAssessment ? "Retake Assessment" : "Start Assessment"}
            </Link>
          </div>
        </div>

        {/* Score cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Competency Score"
            value={hasAssessment ? overallScore : "—"}
            bg="bg-blue-700"
          />
          <StatCard label="Courses Completed" value={14} bg="bg-red-700" />
          <StatCard label="Learning Hours" value={39} bg="bg-green-700" />
          <StatCard label="Certificates" value={6} bg="bg-yellow-600" />
        </div>

        {/* Assessment CTA */}
        {!hasAssessment && (
          <div className="mt-10 rounded-2xl border border-yellow-600/40 bg-yellow-900/20 p-8">
            <h2 className="text-2xl font-black text-yellow-400">
              Complete Your Financial Competency Assessment
            </h2>
            <p className="mt-3 text-slate-300">
              Discover your strengths, identify opportunities, and receive a personalized learning roadmap.
            </p>
            <Link
              href="/assessment"
              className="mt-6 inline-block rounded-xl bg-yellow-600 px-6 py-3 font-bold hover:bg-yellow-700"
            >
              Take the Free Assessment →
            </Link>
          </div>
        )}

        {/* Progress bars */}
        <div className="mt-12 rounded-2xl bg-slate-900 p-10">
          <h2 className="text-3xl font-black">Financial Competency Progress</h2>
          <div className="mt-8 space-y-6">
            {[
              { label: "Personal Finance", pct: 91, color: "bg-green-500" },
              { label: "Real Estate", pct: 76, color: "bg-red-500" },
              { label: "Paper Assets", pct: 84, color: "bg-white" },
              { label: "Business", pct: 95, color: "bg-blue-500" },
              { label: "Risk Management", pct: 79, color: "bg-yellow-500" },
            ].map(({ label, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm font-semibold">
                  <span>{label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-slate-700">
                  <div
                    className={`h-3 rounded-full ${color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended courses + Badges */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-slate-900 p-10">
            <h2 className="text-3xl font-black">Recommended Next Courses</h2>
            <div className="mt-8 space-y-4">
              {[
                {
                  title: "Building Wealth Through Real Estate",
                  desc: "Real Estate competency is below your overall average.",
                },
                {
                  title: "Advanced Risk Management",
                  desc: "Improve wealth preservation and long-term security.",
                },
                {
                  title: "Executive KPI Dashboard",
                  desc: "Strengthen business decision-making with measurable KPIs.",
                },
              ].map(({ title, desc }) => (
                <div key={title} className="rounded-xl bg-slate-800 p-5">
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 p-10">
            <h2 className="text-3xl font-black">Achievement Badges</h2>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { icon: "🥇", label: "First Assessment", border: "border-yellow-500" },
                { icon: "📈", label: "Investment Explorer", border: "border-blue-500" },
                { icon: "🏘️", label: "Real Estate Student", border: "border-red-500" },
                { icon: "💼", label: "Business Builder", border: "border-green-500" },
              ].map(({ icon, label, border }) => (
                <div key={label} className={`rounded-xl border ${border} p-5 text-center`}>
                  <span className="text-3xl">{icon}</span>
                  <p className="mt-3 text-sm font-bold">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/courses"
            className="rounded-xl bg-blue-600 px-8 py-4 font-bold hover:bg-blue-700"
          >
            Continue Learning
          </Link>
          <Link
            href="/assessment"
            className="rounded-xl border border-white px-8 py-4 font-bold hover:bg-white hover:text-black"
          >
            Retake Assessment
          </Link>
          <Link
            href="/course-catalog"
            className="rounded-xl border border-green-500 px-8 py-4 font-bold hover:bg-green-600"
          >
            Course Catalog
          </Link>
          <Link
            href="/membership"
            className={`rounded-xl border border-yellow-500 px-8 py-4 font-bold hover:bg-yellow-600 ${
              user.membershipTier !== "free" ? "hidden" : ""
            }`}
          >
            Upgrade Membership
          </Link>
        </div>
      </section>
    </main>
  );
}
