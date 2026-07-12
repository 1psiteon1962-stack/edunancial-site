"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/authContext";
import { getDashboardData } from "@/lib/dashboard/dashboard-service";

const SUBSCRIPTION_STYLES = {
  Basic: "border-blue-400/40 bg-blue-500/10 text-blue-200",
  Pro: "border-violet-400/40 bg-violet-500/10 text-violet-200",
  Gold: "border-yellow-400/50 bg-yellow-500/10 text-yellow-100",
} as const;

const TRACK_STYLES = {
  RED: {
    accent: "text-red-200",
    border: "border-red-500/40",
    surface: "bg-red-500/10",
    progress: "bg-red-400",
  },
  WHITE: {
    accent: "text-slate-100",
    border: "border-white/20",
    surface: "bg-white/5",
    progress: "bg-slate-100",
  },
  BLUE: {
    accent: "text-blue-200",
    border: "border-blue-500/40",
    surface: "bg-blue-500/10",
    progress: "bg-blue-400",
  },
} as const;

function ProgressBar({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: number;
  colorClass: string;
}) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div>
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-semibold text-white">{safeValue}%</span>
      </div>
      <div
        className="mt-2 h-3 rounded-full bg-slate-800"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeValue}
      >
        <div className={`h-3 rounded-full ${colorClass}`} style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">{label}</p>
      <p className="mt-4 text-4xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
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

  const dashboardData = useMemo(() => (user ? getDashboardData(user) : null), [user]);

  if (loading || !user || !dashboardData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08101f]">
        <p className="text-slate-400">Loading…</p>
      </main>
    );
  }

  const subscriptionStyle = SUBSCRIPTION_STYLES[dashboardData.subscriptionLevel];
  const continueTrackStyle = TRACK_STYLES[dashboardData.continueLearning.trackCode];

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <header className="rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
                Member Dashboard
              </p>
              <h1 className="mt-4 text-4xl font-black sm:text-5xl">
                Welcome back, {dashboardData.memberName}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Your North American learning experience keeps your subscription, learning
                paths, competency progress, certificates, downloads, and announcements in one
                accessible place.
              </p>
              <div
                className={`mt-5 inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold ${subscriptionStyle}`}
              >
                {dashboardData.subscriptionLevel} subscription
              </div>
            </div>

            <nav aria-label="Member dashboard actions" className="flex flex-wrap gap-3">
              <Link
                href="/continue-learning"
                className="rounded-xl bg-blue-600 px-5 py-3 font-bold transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
              >
                Continue Learning
              </Link>
              <Link
                href="/my-certificates"
                className="rounded-xl border border-slate-600 px-5 py-3 font-bold text-slate-200 transition hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                My Certificates
              </Link>
              <Link
                href="/profile"
                className="rounded-xl border border-yellow-500/60 px-5 py-3 font-bold text-yellow-200 transition hover:bg-yellow-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
              >
                My Profile
              </Link>
            </nav>
          </div>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Subscription Level"
            value={dashboardData.subscriptionLevel}
            detail="Mapped to the current authentication and membership account tier."
          />
          <StatCard
            label="Competency Score"
            value={dashboardData.competencyScore ?? "Pending"}
            detail={
              dashboardData.assessmentCompleted
                ? "Latest Financial Competency assessment result."
                : "Complete the assessment to personalize your dashboard."
            }
          />
          <StatCard
            label="Course Completion"
            value={`${dashboardData.courseCompletionPercentage}%`}
            detail="Average completion across the Red, White, and Blue launch paths."
          />
          <StatCard
            label="Certificates"
            value={dashboardData.certificatesEarned}
            detail={`${dashboardData.downloadsAvailable} dashboard downloads available right now.`}
          />
        </div>

        {!dashboardData.assessmentCompleted && (
          <section className="mt-8 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6">
            <h2 className="text-2xl font-black text-yellow-300">
              Complete your Financial Competency Assessment
            </h2>
            <p className="mt-3 max-w-3xl text-slate-200">
              Your dashboard is already connected to membership and learning-path progress. Finish
              the assessment to unlock a scored Competency Passport rank and sharper next-step
              guidance.
            </p>
            <Link
              href="/assessment"
              className="mt-5 inline-flex rounded-xl bg-yellow-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-200"
            >
              Start Assessment
            </Link>
          </section>
        )}

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <section
            aria-labelledby="continue-learning-heading"
            className={`rounded-3xl border ${continueTrackStyle.border} ${continueTrackStyle.surface} p-8`}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className={`text-sm font-bold uppercase tracking-[0.4em] ${continueTrackStyle.accent}`}>
                  Continue Learning
                </p>
                <h2 id="continue-learning-heading" className="mt-3 text-3xl font-black">
                  {dashboardData.continueLearning.lessonTitle}
                </h2>
                <p className="mt-3 text-slate-200">
                  Next unfinished lesson in the {dashboardData.continueLearning.trackTitle} path ·{" "}
                  {dashboardData.continueLearning.currentLevel}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {dashboardData.continueLearning.lessonLabel}
                </p>
              </div>

              <div className="min-w-0 rounded-2xl border border-black/10 bg-slate-950/60 p-5 lg:w-72">
                <ProgressBar
                  label={`${dashboardData.continueLearning.trackTitle} completion`}
                  value={dashboardData.continueLearning.completionPercentage}
                  colorClass={continueTrackStyle.progress}
                />
                <Link
                  href={dashboardData.continueLearning.href}
                  className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Resume Path
                </Link>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="passport-progress-heading"
            className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.4em] text-green-300">
                  Competency Passport
                </p>
                <h2 id="passport-progress-heading" className="mt-3 text-3xl font-black">
                  {dashboardData.passport.rank} status
                </h2>
              </div>
              <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-200">
                {dashboardData.passport.status}
              </span>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-950/70 p-4">
                <dt className="text-sm text-slate-400">Overall score</dt>
                <dd className="mt-2 text-3xl font-black">
                  {dashboardData.passport.overallScore ?? "Pending"}
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-950/70 p-4">
                <dt className="text-sm text-slate-400">Recommended track</dt>
                <dd className="mt-2 text-3xl font-black">{dashboardData.passport.recommendedTrack}</dd>
              </div>
              <div className="rounded-2xl bg-slate-950/70 p-4">
                <dt className="text-sm text-slate-400">Lessons completed</dt>
                <dd className="mt-2 text-3xl font-black">
                  {dashboardData.passport.lessonsCompleted}/{dashboardData.passport.totalLessons}
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-950/70 p-4">
                <dt className="text-sm text-slate-400">Certificates earned</dt>
                <dd className="mt-2 text-3xl font-black">
                  {dashboardData.passport.certificatesEarned}
                </dd>
              </div>
            </dl>

            <div className="mt-6 space-y-4">
              <ProgressBar
                label="Passport completion"
                value={dashboardData.passport.completionPercentage}
                colorClass="bg-green-400"
              />
              <ProgressBar
                label={`Progress toward ${dashboardData.passport.nextRank}`}
                value={dashboardData.passport.overallScore ?? 0}
                colorClass="bg-blue-400"
              />
            </div>

            <p className="mt-4 text-sm text-slate-400">
              {dashboardData.passport.pointsToNextRank > 0
                ? `${dashboardData.passport.pointsToNextRank} more points to reach ${dashboardData.passport.nextRank}.`
                : "You are currently at the top published passport rank."}
            </p>
          </section>
        </div>

        <section aria-labelledby="learning-paths-heading" className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.4em] text-slate-400">
                Learning Paths
              </p>
              <h2 id="learning-paths-heading" className="mt-2 text-3xl font-black">
                Red, White, and Blue progress
              </h2>
            </div>
            <Link
              href="/course-progress"
              className="text-sm font-semibold text-blue-300 transition hover:text-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
            >
              View full course progress →
            </Link>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {dashboardData.learningPaths.map((path) => {
              const trackStyle = TRACK_STYLES[path.code];

              return (
                <article
                  key={path.code}
                  className={`rounded-3xl border ${trackStyle.border} bg-slate-900/90 p-6`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={`text-sm font-bold uppercase tracking-[0.35em] ${trackStyle.accent}`}>
                        {path.code}
                      </p>
                      <h3 className="mt-3 text-2xl font-black">{path.title}</h3>
                      <p className="mt-2 text-sm text-slate-400">{path.courseTitle}</p>
                    </div>
                    <span className="rounded-full bg-slate-950/70 px-3 py-1 text-sm font-semibold text-slate-200">
                      {path.currentLevel}
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    <ProgressBar
                      label={`${path.title} completion`}
                      value={path.completionPercentage}
                      colorClass={trackStyle.progress}
                    />
                    <dl className="grid gap-3 text-sm text-slate-300">
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-slate-400">Next lesson</dt>
                        <dd className="text-right font-semibold text-white">{path.nextLessonLabel}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-slate-400">Assessment status</dt>
                        <dd className="text-right">{path.assessmentStatus}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <dt className="text-slate-400">Certificates earned</dt>
                        <dd className="font-semibold text-white">{path.certificatesEarned}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/courses/${path.courseId}`}
                      className="rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Open Path
                    </Link>
                    <Link
                      href="/continue-learning"
                      className="rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-bold text-slate-200 transition hover:border-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200"
                    >
                      Continue
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <div className="mt-8 grid gap-8 xl:grid-cols-2">
          <section
            aria-labelledby="certificates-heading"
            className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.4em] text-slate-400">
                  Certificates
                </p>
                <h2 id="certificates-heading" className="mt-2 text-3xl font-black">
                  Earned and in progress
                </h2>
              </div>
              <Link
                href="/my-certificates"
                className="text-sm font-semibold text-yellow-300 transition hover:text-yellow-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
              >
                Open certificate center →
              </Link>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-bold text-green-300">Earned</h3>
                <ul className="mt-4 space-y-3">
                  {dashboardData.earnedCertificates.map((certificate) => (
                    <li key={certificate.id} className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
                      <p className="font-semibold text-white">{certificate.title}</p>
                      <p className="mt-1 text-sm text-slate-300">{certificate.trackTitle}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-blue-300">In Progress</h3>
                <ul className="mt-4 space-y-3">
                  {dashboardData.certificatesInProgress.map((certificate) => (
                    <li key={certificate.id} className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-white">{certificate.title}</p>
                        <span className="text-sm font-semibold text-blue-200">
                          {certificate.completionPercentage}%
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-300">{certificate.trackTitle}</p>
                      <div
                        className="mt-3 h-2 rounded-full bg-slate-800"
                        role="progressbar"
                        aria-label={`${certificate.title} progress`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={certificate.completionPercentage}
                      >
                        <div
                          className="h-2 rounded-full bg-blue-400"
                          style={{ width: `${certificate.completionPercentage}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="downloads-heading"
            className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.4em] text-slate-400">
                  Downloads
                </p>
                <h2 id="downloads-heading" className="mt-2 text-3xl font-black">
                  Books, PDFs, worksheets, and audio
                </h2>
              </div>
              <Link
                href="/library"
                className="text-sm font-semibold text-blue-300 transition hover:text-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
              >
                Browse library →
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {dashboardData.downloads.map((download) => (
                <article key={download.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
                        {download.category}
                      </p>
                      <h3 className="mt-2 text-lg font-black">{download.title}</h3>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-200">
                      {download.format}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-400">
                    Access: {download.accessLevel === "membership" ? "Member Library" : download.accessLevel}
                  </p>
                  <Link
                    href={download.href}
                    className="mt-5 inline-flex rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-bold text-slate-100 transition hover:border-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
                  >
                    Open Resource
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section
          aria-labelledby="announcements-heading"
          className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/90 p-8"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.4em] text-slate-400">
                Announcements
              </p>
              <h2 id="announcements-heading" className="mt-2 text-3xl font-black">
                Recent Edunancial updates
              </h2>
            </div>
            <Link
              href="/membership"
              className="text-sm font-semibold text-blue-300 transition hover:text-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
            >
              Membership updates →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {dashboardData.announcements.map((announcement) => (
              <article key={announcement.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <p className="text-sm font-semibold text-slate-400">{announcement.date}</p>
                <h3 className="mt-2 text-xl font-black">{announcement.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{announcement.detail}</p>
                <Link
                  href={announcement.href}
                  className="mt-5 inline-flex text-sm font-bold text-yellow-300 transition hover:text-yellow-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
                >
                  Learn more →
                </Link>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
