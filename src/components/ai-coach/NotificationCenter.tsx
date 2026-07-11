import { AINotification } from "@/types/ai-coach";
import {
  NOTIFICATION_CATEGORY_LABELS,
  NOTIFICATION_PRIORITY_COLORS,
} from "@/lib/ai-coach/notification-manager";
import Link from "next/link";

interface Props {
  notifications: AINotification[];
  compact?: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationCenter({ notifications, compact = false }: Props) {
  const active = notifications.filter((n) => !n.isDismissed);
  const unread = active.filter((n) => !n.isRead).length;

  return (
    <div className="rounded-2xl bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">
          Notifications
          {unread > 0 && (
            <span
              className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-sm"
              aria-label={`${unread} unread notifications`}
            >
              {unread}
            </span>
          )}
        </h2>
        {!compact && (
          <Link
            href="/ai-coach/notifications"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            View All
          </Link>
        )}
      </div>

      {active.length === 0 ? (
        <p className="mt-6 text-slate-400">No notifications. You're all caught up!</p>
      ) : (
        <ul className="mt-5 space-y-3" aria-label="Notifications">
          {(compact ? active.slice(0, 4) : active).map((notif) => (
            <li
              key={notif.id}
              className={`rounded-xl border-l-4 ${NOTIFICATION_PRIORITY_COLORS[notif.priority]} bg-slate-800 p-4 ${
                !notif.isRead ? "ring-1 ring-white/10" : "opacity-75"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className={`text-sm font-bold ${!notif.isRead ? "text-white" : "text-slate-300"}`}
                  >
                    {notif.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{notif.message}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                      {NOTIFICATION_CATEGORY_LABELS[notif.category]}
                    </span>
                    <span className="text-xs text-slate-500">
                      {timeAgo(notif.createdAt)}
                    </span>
                  </div>
                </div>
                {!notif.isRead && (
                  <span
                    className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-400"
                    aria-hidden="true"
                  />
                )}
              </div>
              {notif.actionUrl && notif.actionLabel && (
                <Link
                  href={notif.actionUrl}
                  className="mt-3 inline-block text-xs font-bold text-blue-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                >
                  {notif.actionLabel} →
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
