"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { sampleNotifications } from "@/data/notifications";
import type { Notification, NotificationEvent } from "@/types/support";

type NotificationFilter = "all" | "unread" | "read";

const notificationIcons: Record<NotificationEvent, string> = {
  welcome: "👋",
  payment_confirmation: "💳",
  course_completion: "🎓",
  certificate_earned: "🏅",
  security_alert: "🔒",
  membership_renewal: "🔁",
  password_reset: "🔑",
  new_course: "📚",
  account_activity: "👤",
  billing_receipt: "🧾",
};

const filterTabs: { label: string; value: NotificationFilter }[] = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Read", value: "read" },
];

function formatTimeAgo(dateString: string): string {
  const createdAt = new Date(dateString).getTime();
  const diffMs = Date.now() - createdAt;

  if (diffMs <= 0) {
    return "Just now";
  }

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (diffMs < minute) {
    return "Just now";
  }

  if (diffMs < hour) {
    const minutes = Math.floor(diffMs / minute);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  if (diffMs < week) {
    const days = Math.floor(diffMs / day);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  if (diffMs < month) {
    const weeks = Math.floor(diffMs / week);
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }

  if (diffMs < year) {
    const months = Math.floor(diffMs / month);
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }

  const years = Math.floor(diffMs / year);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    [...sampleNotifications].sort(
      (first, second) =>
        new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
    ),
  );
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "unread") {
      return notifications.filter((notification) => !notification.read);
    }

    if (activeFilter === "read") {
      return notifications.filter((notification) => notification.read);
    }

    return notifications;
  }, [activeFilter, notifications]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  };

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
              MEMBER UPDATES
            </p>
            <h1 className="mt-6 text-5xl font-black">Notifications</h1>
            <p className="mt-4 max-w-2xl text-slate-300">
              Stay on top of course progress, billing updates, and important account activity.
            </p>
          </div>

          <button
            type="button"
            onClick={markAllAsRead}
            className="rounded-lg border border-white/10 px-5 py-3 font-bold text-white transition hover:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={unreadCount === 0}
          >
            Mark all as read
          </button>
        </div>

        <div className="mt-10 flex flex-col gap-4 rounded-xl border border-white/10 bg-[#101a2f] p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-3" aria-label="Notification filters">
            {filterTabs.map((tab) => {
              const isActive = tab.value === activeFilter;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveFilter(tab.value)}
                  className={`rounded-lg px-5 py-3 font-bold transition ${
                    isActive
                      ? "bg-blue-600 text-white hover:bg-blue-500"
                      : "border border-white/10 text-slate-300 hover:border-blue-500 hover:text-white"
                  }`}
                  aria-pressed={isActive}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <Link
            href="/settings/notifications"
            className="font-bold text-blue-400 transition hover:text-blue-300"
          >
            Manage notification preferences
          </Link>
        </div>

        <section className="mt-10" aria-live="polite">
          {filteredNotifications.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-slate-900 p-8 text-slate-300">
              No notifications match this filter.
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredNotifications.map((notification) => {
                const content = (
                  <>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#101a2f] text-2xl">
                        <span aria-hidden="true">{notificationIcons[notification.type]}</span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0">
                            <div className="flex items-center gap-3">
                              <h2 className="text-xl font-black text-white">
                                {notification.title}
                              </h2>
                              {!notification.read ? (
                                <span
                                  className="h-3 w-3 shrink-0 rounded-full bg-blue-400"
                                  aria-label="Unread notification"
                                />
                              ) : null}
                            </div>
                            <p className="mt-3 text-slate-300">{notification.message}</p>
                          </div>

                          <p className="shrink-0 text-sm text-slate-400">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>

                        {notification.actionLabel ? (
                          <p className="mt-4 font-bold text-blue-400">
                            {notification.actionLabel}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </>
                );

                return (
                  <li key={notification.id}>
                    {notification.actionUrl ? (
                      <Link
                        href={notification.actionUrl}
                        onClick={() => markNotificationAsRead(notification.id)}
                        className="block rounded-xl border border-white/10 bg-slate-900 p-8 text-left transition hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#08101f]"
                      >
                        {content}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markNotificationAsRead(notification.id)}
                        className="block w-full rounded-xl border border-white/10 bg-slate-900 p-8 text-left transition hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#08101f]"
                      >
                        {content}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}
