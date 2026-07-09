"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { defaultCommunicationPreferences } from "@/data/notifications";
import type {
  CommunicationCategoryPrefs,
  CommunicationPreferences,
} from "@/types/support";

type ChannelKey = "email" | "inApp" | "sms" | "push";
type PreferenceKey = keyof CommunicationCategoryPrefs;

const preferenceItems: { key: PreferenceKey; label: string; required?: boolean }[] = [
  { key: "marketing", label: "Marketing Emails" },
  { key: "educationalUpdates", label: "Educational Updates" },
  { key: "billing", label: "Billing Notifications" },
  { key: "security", label: "Security Alerts", required: true },
  { key: "productUpdates", label: "Product Updates" },
  { key: "newsletter", label: "Newsletter" },
  { key: "courseAnnouncements", label: "Course Announcements" },
];

const channelSections: {
  key: ChannelKey;
  title: string;
  description: string;
  disabled?: boolean;
  badge?: string;
}[] = [
  {
    key: "email",
    title: "Email",
    description: "Choose which updates we can send to your inbox.",
  },
  {
    key: "inApp",
    title: "In-App Notifications",
    description: "Control the alerts and reminders shown in your account.",
  },
  {
    key: "sms",
    title: "SMS",
    description: "Text message controls will be available in a future release.",
    disabled: true,
    badge: "Coming Soon",
  },
  {
    key: "push",
    title: "Push",
    description: "Push notification controls will be available in a future release.",
    disabled: true,
    badge: "Coming Soon",
  },
];

function ToggleSwitch({
  checked,
  disabled,
  label,
  onToggle,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      disabled={disabled}
      className={`relative inline-flex h-7 w-12 items-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#08101f] ${
        disabled
          ? "cursor-not-allowed border-white/10 bg-slate-800 opacity-60"
          : checked
            ? "border-blue-500 bg-blue-600"
            : "border-white/10 bg-[#101a2f] hover:border-blue-500"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] = useState<CommunicationPreferences>(
    defaultCommunicationPreferences,
  );
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleToggle = (channel: ChannelKey, category: PreferenceKey) => {
    if (channel === "sms" || channel === "push" || category === "security") {
      return;
    }

    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      [channel]: {
        ...currentPreferences[channel],
        [category]: !currentPreferences[channel][category],
      },
    }));
  };

  const handleSave = () => {
    setShowSavedMessage(true);

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setShowSavedMessage(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/settings" className="transition hover:text-blue-400">
                Settings
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-white">Notifications</li>
          </ol>
        </nav>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.45em] text-yellow-400">
              COMMUNICATION SETTINGS
            </p>
            <h1 className="mt-6 text-5xl font-black">Notification Preferences</h1>
            <p className="mt-4 max-w-3xl text-slate-300">
              Customize how you receive updates about your learning progress, billing, and
              account activity.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 md:items-end">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#08101f]"
            >
              Save Preferences
            </button>
            {showSavedMessage ? (
              <p className="text-sm font-bold text-green-400">Preferences saved!</p>
            ) : null}
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-white/10 bg-[#101a2f] p-6 text-slate-300">
          Security alerts and critical billing notifications cannot be disabled.
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-2">
          {channelSections.map((channel) => (
            <section
              key={channel.key}
              className={`rounded-xl border border-white/10 bg-slate-900 p-8 ${
                channel.disabled ? "opacity-80" : "hover:border-blue-500"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black text-white">{channel.title}</h2>
                  <p className="mt-3 text-slate-300">{channel.description}</p>
                </div>

                {channel.badge ? (
                  <span className="rounded-full border border-white/10 bg-[#101a2f] px-4 py-2 text-sm font-bold text-slate-300">
                    {channel.badge}
                  </span>
                ) : null}
              </div>

              <div className="mt-8 space-y-5">
                {preferenceItems.map((preference) => {
                  const checked = preferences[channel.key][preference.key];
                  const isDisabled = channel.disabled || preference.required;

                  return (
                    <div
                      key={`${channel.key}-${preference.key}`}
                      className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#101a2f] p-4"
                    >
                      <div>
                        <p className="font-bold text-white">{preference.label}</p>
                        {preference.required ? (
                          <p className="mt-1 text-sm text-yellow-400">Always on</p>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-3">
                        {isDisabled ? (
                          <span className="text-sm font-bold text-slate-400">
                            {preference.required ? "Required" : "Unavailable"}
                          </span>
                        ) : null}

                        <ToggleSwitch
                          checked={checked}
                          disabled={isDisabled}
                          label={`${channel.title} ${preference.label}`}
                          onToggle={() => handleToggle(channel.key, preference.key)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
