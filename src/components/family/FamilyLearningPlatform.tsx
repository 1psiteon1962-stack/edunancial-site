import Link from "next/link";

import {
  familyAchievements,
  familyAccounts,
  familyDashboardStats,
  familyNotifications,
  familyRecommendations,
  familyReports,
  householdGoals,
  parentPermissions,
  sharedProgress,
} from "@/data/familyPlatform";

interface FamilyLearningPlatformProps {
  eyebrow: string;
  title: string;
  description: string;
}

const priorityStyles = {
  High: "border-red-500/40 bg-red-500/10 text-red-200",
  Medium: "border-yellow-500/40 bg-yellow-500/10 text-yellow-200",
  Low: "border-blue-500/40 bg-blue-500/10 text-blue-200",
} as const;

export default function FamilyLearningPlatform({
  eyebrow,
  title,
  description,
}: FamilyLearningPlatformProps) {
  return (
    <div className="space-y-10">
      <section
        aria-labelledby="family-platform-heading"
        className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 sm:p-10 lg:p-14"
      >
        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          {eyebrow}
        </p>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_0.9fr]">
          <div>
            <h1
              id="family-platform-heading"
              className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl"
            >
              {title}
            </h1>

            <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300 sm:text-xl">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="rounded-xl bg-blue-600 px-6 py-4 font-bold transition hover:bg-blue-500"
              >
                Open family dashboard
              </Link>
              <Link
                href="/notifications"
                className="rounded-xl border border-slate-600 px-6 py-4 font-bold text-slate-100 transition hover:border-slate-400"
              >
                View notifications
              </Link>
              <Link
                href="/family-challenges"
                className="rounded-xl border border-green-500 px-6 py-4 font-bold text-green-200 transition hover:bg-green-500/10"
              >
                Explore challenges
              </Link>
            </div>
          </div>

          <aside
            aria-label="Family dashboard summary"
            className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6"
          >
            <h2 className="text-2xl font-black">Dashboard snapshot</h2>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {familyDashboardStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5"
                >
                  <dt className="text-sm uppercase tracking-[0.2em] text-slate-400">
                    {stat.label}
                  </dt>
                  <dd className="mt-3 text-3xl font-black text-white">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section
        aria-labelledby="family-accounts-heading"
        className="rounded-3xl bg-slate-900/80 p-8 sm:p-10"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-bold uppercase tracking-[0.35em] text-blue-300">
              Parent and child accounts
            </p>
            <h2 id="family-accounts-heading" className="mt-3 text-3xl font-black">
              One household, tailored access for every learner
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Parents can guide the experience while children and teens receive
            the right lessons, milestones, and permissions for their stage.
          </p>
        </div>

        <ul className="mt-8 grid gap-6 lg:grid-cols-3">
          {familyAccounts.map((account) => (
            <li
              key={account.id}
              className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                    {account.role}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold">{account.name}</h3>
                  <p className="mt-1 text-sm text-blue-200">{account.ageBand}</p>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-semibold text-slate-200">
                  {account.progress}% on track
                </span>
              </div>

              <p className="mt-5 text-slate-300">{account.focus}</p>

              <ul className="mt-5 space-y-3 text-sm text-slate-200">
                {account.permissions.map((permission) => (
                  <li key={permission} className="rounded-xl bg-slate-900 px-4 py-3">
                    {permission}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
        <section
          aria-labelledby="household-goals-heading"
          className="rounded-3xl bg-slate-900/80 p-8 sm:p-10"
        >
          <p className="font-bold uppercase tracking-[0.35em] text-green-300">
            Household financial goals
          </p>
          <h2 id="household-goals-heading" className="mt-3 text-3xl font-black">
            Shared targets keep every learner aligned
          </h2>

          <div className="mt-8 space-y-5">
            {householdGoals.map((goal) => (
              <article
                key={goal.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{goal.title}</h3>
                    <p className="mt-2 text-slate-300">{goal.target}</p>
                  </div>
                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-200">
                    {goal.progress}% complete
                  </span>
                </div>
                <div
                  className="mt-5 h-3 rounded-full bg-slate-800"
                  role="progressbar"
                  aria-label={goal.title}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={goal.progress}
                >
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <p className="mt-4 text-sm text-slate-400">{goal.status}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="parent-permissions-heading"
          className="rounded-3xl bg-slate-900/80 p-8 sm:p-10"
        >
          <p className="font-bold uppercase tracking-[0.35em] text-yellow-300">
            Parent permissions
          </p>
          <h2 id="parent-permissions-heading" className="mt-3 text-3xl font-black">
            Adults stay in control without slowing progress
          </h2>

          <div className="mt-8 space-y-5">
            {parentPermissions.map((permission) => (
              <article
                key={permission.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6"
              >
                <h3 className="text-xl font-bold">{permission.title}</h3>
                <p className="mt-3 text-slate-300">{permission.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-10 xl:grid-cols-[1fr_1fr]">
        <section
          aria-labelledby="shared-progress-heading"
          className="rounded-3xl bg-slate-900/80 p-8 sm:p-10"
        >
          <p className="font-bold uppercase tracking-[0.35em] text-cyan-300">
            Shared progress tracking
          </p>
          <h2 id="shared-progress-heading" className="mt-3 text-3xl font-black">
            Families can review growth together every week
          </h2>

          <div className="mt-8 space-y-5">
            {sharedProgress.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{item.learner}</h3>
                    <p className="mt-2 text-slate-300">{item.course}</p>
                  </div>
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-200">
                    {item.completion}% complete
                  </span>
                </div>
                <div
                  className="mt-5 h-3 rounded-full bg-slate-800"
                  role="progressbar"
                  aria-label={`${item.learner} progress`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={item.completion}
                >
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"
                    style={{ width: `${item.completion}%` }}
                  />
                </div>
                <p className="mt-4 text-sm text-slate-400">{item.milestone}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="family-recommendations-heading"
          className="rounded-3xl bg-slate-900/80 p-8 sm:p-10"
        >
          <p className="font-bold uppercase tracking-[0.35em] text-pink-300">
            Age-appropriate course recommendations
          </p>
          <h2 id="family-recommendations-heading" className="mt-3 text-3xl font-black">
            Every age band gets the right next step
          </h2>

          <div className="mt-8 space-y-5">
            {familyRecommendations.map((recommendation) => (
              <article
                key={recommendation.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-pink-500/10 px-3 py-1 text-sm font-semibold text-pink-200">
                    {recommendation.ageGroup}
                  </span>
                  <span className="text-sm text-slate-400">
                    {recommendation.duration}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold">{recommendation.title}</h3>
                <p className="mt-3 text-slate-300">{recommendation.reason}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-10 xl:grid-cols-[0.9fr_1.1fr]">
        <section
          aria-labelledby="family-achievements-heading"
          className="rounded-3xl bg-slate-900/80 p-8 sm:p-10"
        >
          <p className="font-bold uppercase tracking-[0.35em] text-amber-300">
            Family achievements
          </p>
          <h2 id="family-achievements-heading" className="mt-3 text-3xl font-black">
            Visible wins make progress feel real
          </h2>

          <ul className="mt-8 space-y-5">
            {familyAchievements.map((achievement) => (
              <li
                key={achievement.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl" aria-hidden="true">
                    {achievement.icon}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold">{achievement.title}</h3>
                    <p className="mt-2 text-slate-300">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="family-notifications-heading"
          className="rounded-3xl bg-slate-900/80 p-8 sm:p-10"
        >
          <p className="font-bold uppercase tracking-[0.35em] text-red-300">
            Notifications and reporting
          </p>
          <h2 id="family-notifications-heading" className="mt-3 text-3xl font-black">
            Timely updates keep the household moving
          </h2>

          <div className="mt-8 space-y-5">
            {familyNotifications.map((notification) => (
              <article
                key={notification.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="text-xl font-bold">{notification.title}</h3>
                  <span
                    className={`rounded-full border px-3 py-1 text-sm font-semibold ${priorityStyles[notification.priority]}`}
                  >
                    {notification.priority} priority
                  </span>
                </div>
                <p className="mt-3 text-slate-300">{notification.message}</p>
                <p className="mt-4 text-sm font-semibold text-blue-200">
                  {notification.action}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {familyReports.map((report) => (
              <article
                key={report.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
              >
                <h3 className="text-lg font-bold">{report.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {report.summary}
                </p>
                <p className="mt-4 text-sm font-semibold text-green-200">
                  {report.metric}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
