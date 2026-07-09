import type { Metadata } from "next";
import AICoachLayout from "@/components/ai-coach/AICoachLayout";
import NotificationCenter from "@/components/ai-coach/NotificationCenter";
import { getDemoNotifications, NOTIFICATION_CATEGORY_LABELS } from "@/lib/ai-coach/notification-manager";
import type { NotificationCategory } from "@/types/ai-coach";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Notifications | AI Coach | Edunancial",
  description:
    "Daily reminders, weekly progress reports, goal milestones, course reminders, and achievement notifications from your Edunancial AI Coach.",
};

export default function NotificationsPage() {
  const notifications = getDemoNotifications("demo");

  const categories: NotificationCategory[] = [
    "dailyReminder",
    "weeklyReport",
    "goalMilestone",
    "courseReminder",
    "assessmentReminder",
    "achievement",
  ];

  const byCategory = categories
    .map((cat) => ({
      category: cat,
      label: NOTIFICATION_CATEGORY_LABELS[cat],
      items: notifications.filter((n) => n.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <AICoachLayout activeHref="/ai-coach/notifications">
      {/* Header */}
      <section aria-labelledby="notifications-heading">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Notifications
        </p>
        <h1 id="notifications-heading" className="mt-3 text-5xl font-black">
          Your Notification Center
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Stay on top of your financial journey with daily reminders, progress reports, goal milestones, and achievement alerts.
        </p>
      </section>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-slate-900 p-5 text-center">
          <p className="text-4xl font-black text-blue-400">{notifications.length}</p>
          <p className="mt-1 text-sm text-slate-400">Total</p>
        </div>
        <div className="rounded-xl bg-slate-900 p-5 text-center">
          <p className="text-4xl font-black text-red-400">
            {notifications.filter((n) => !n.isRead).length}
          </p>
          <p className="mt-1 text-sm text-slate-400">Unread</p>
        </div>
        <div className="rounded-xl bg-slate-900 p-5 text-center">
          <p className="text-4xl font-black text-yellow-400">
            {notifications.filter((n) => n.priority === "high").length}
          </p>
          <p className="mt-1 text-sm text-slate-400">High Priority</p>
        </div>
      </div>

      {/* Full notification list */}
      <div className="mt-8">
        <NotificationCenter notifications={notifications} />
      </div>

      {/* Categories */}
      <div className="mt-12 rounded-2xl bg-slate-900 p-6">
        <h2 className="text-xl font-black">Notification Types</h2>
        <p className="mt-2 text-sm text-slate-400">
          Edunancial sends these notification categories to keep you progressing.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { cat: "dailyReminder" as NotificationCategory, icon: "☀️", desc: "Motivational daily nudge with your streak and today's action." },
            { cat: "weeklyReport" as NotificationCategory, icon: "📊", desc: "Weekly summary of learning time, goal progress, and score changes." },
            { cat: "goalMilestone" as NotificationCategory, icon: "🎯", desc: "Celebration when you hit a goal milestone." },
            { cat: "courseReminder" as NotificationCategory, icon: "📚", desc: "Nudge to continue a course you haven't touched in 7+ days." },
            { cat: "assessmentReminder" as NotificationCategory, icon: "📋", desc: "Quarterly reminder to retake the competency assessment." },
            { cat: "achievement" as NotificationCategory, icon: "🏆", desc: "Badge and recognition when you unlock a new achievement." },
          ].map(({ cat, icon, desc }) => (
            <div key={cat} className="rounded-xl bg-slate-800 p-4">
              <span className="text-2xl" aria-hidden="true">{icon}</span>
              <h3 className="mt-2 font-bold">{NOTIFICATION_CATEGORY_LABELS[cat]}</h3>
              <p className="mt-1 text-sm text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/ai-coach"
          className="rounded-xl border border-slate-600 px-6 py-3 font-bold text-slate-300 hover:border-white hover:text-white"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </AICoachLayout>
  );
}
