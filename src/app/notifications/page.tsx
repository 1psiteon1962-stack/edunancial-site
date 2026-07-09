import Link from "next/link";

import { familyNotifications, familyReports } from "@/data/familyPlatform";

const priorityStyles = {
  High: "border-red-500/30 bg-red-500/10 text-red-200",
  Medium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-200",
  Low: "border-blue-500/30 bg-blue-500/10 text-blue-200",
} as const;

export const metadata = {
  title: "Notifications | Edunancial",
  description:
    "Review household updates, family learning alerts, and reporting summaries.",
};

export default function Notifications() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          Notification Center
        </p>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black sm:text-5xl lg:text-6xl">
              Family updates, reminders, and reports
            </h1>
            <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300 sm:text-xl">
              Keep parents and learners aligned with progress alerts,
              celebration moments, and reporting summaries from one
              accessible notification hub.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/family"
              className="rounded-xl bg-blue-600 px-6 py-4 font-bold hover:bg-blue-500"
            >
              Open Family Platform
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-600 px-6 py-4 font-bold hover:border-slate-400"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <section
            aria-labelledby="recent-notifications-heading"
            className="rounded-3xl bg-slate-900/80 p-8 sm:p-10"
          >
            <h2 id="recent-notifications-heading" className="text-3xl font-black">
              Recent notifications
            </h2>

            <div className="mt-8 space-y-5">
              {familyNotifications.map((notification) => (
                <article
                  key={notification.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{notification.title}</h3>
                      <p className="mt-3 text-slate-300">
                        {notification.message}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-sm font-semibold ${priorityStyles[notification.priority]}`}
                    >
                      {notification.priority}
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-blue-200">
                    {notification.action}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="reporting-highlights-heading"
            className="rounded-3xl bg-slate-900/80 p-8 sm:p-10"
          >
            <h2 id="reporting-highlights-heading" className="text-3xl font-black">
              Reporting highlights
            </h2>

            <div className="mt-8 space-y-5">
              {familyReports.map((report) => (
                <article
                  key={report.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6"
                >
                  <h3 className="text-xl font-bold">{report.title}</h3>
                  <p className="mt-3 text-slate-300">{report.summary}</p>
                  <p className="mt-4 text-sm font-semibold text-green-200">
                    {report.metric}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
              <h3 className="text-xl font-bold">Notification preferences</h3>
              <ul className="mt-4 space-y-3 text-slate-300">
                <li>Email summaries for parents every Friday</li>
                <li>Celebration alerts when learners earn a badge</li>
                <li>Checkpoint reminders before parent approvals are due</li>
              </ul>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
