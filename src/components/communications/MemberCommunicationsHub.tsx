import Link from "next/link";
import {
  announcements,
  channelHealth,
  communicationMetrics,
  getUnreadNotificationCount,
  inAppNotifications,
  memberAlerts,
  messageTemplates,
  preferenceGroups,
  reminderWorkflows,
} from "@/lib/communications/platform";
import {
  AlertGrid,
  AnnouncementCards,
  ChannelGrid,
  MetricGrid,
  NotificationFeed,
  PreferenceGroups,
  SectionHeader,
  TemplateGrid,
} from "@/components/communications/CommunicationBlocks";

export default function MemberCommunicationsHub({
  mode,
}: {
  mode: "notifications" | "messages" | "settings";
}) {
  const heroDescription =
    mode === "settings"
      ? "Manage every channel, cadence, and announcement preference from a single responsive accessibility-first workspace."
      : mode === "messages"
        ? "Review reusable messaging templates, recent delivery activity, and the channels that keep members engaged."
        : "Stay on top of announcements, in-app notifications, reminder automation, and member alerts without leaving your dashboard.";

  const headline =
    mode === "settings"
      ? "Communication preferences"
      : mode === "messages"
        ? "Messaging center"
        : "Notifications center";

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
              Communications Platform
            </p>
            <h1 className="mt-5 text-4xl font-black md:text-6xl">{headline}</h1>
            <p className="mt-6 text-lg text-slate-300 md:text-xl">{heroDescription}</p>
          </div>
          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6 text-left lg:max-w-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-200">Unread items</p>
            <p className="mt-3 text-5xl font-black text-white">{getUnreadNotificationCount()}</p>
            <p className="mt-3 text-sm text-slate-300">
              Includes announcements, reminder escalations, and member alerts waiting for action.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <MetricGrid items={communicationMetrics} />
        </div>

        <div className="mt-16 space-y-16">
          <section aria-labelledby="announcements-heading" className="space-y-8">
            <SectionHeader
              eyebrow="Announcement system"
              title="Pinned updates for every audience"
              description="Announcement publishing now aligns homepage messaging, member alerts, and newsletter recaps so important updates remain visible on mobile and desktop."
            />
            <AnnouncementCards items={announcements} />
          </section>

          {mode !== "settings" ? (
            <section aria-labelledby="notifications-feed-heading" className="space-y-8">
              <SectionHeader
                eyebrow="In-app notification center"
                title="Actionable alerts instead of empty placeholders"
                description="Each notification tracks urgency, category, preferred channel, and a next-step action so members can move directly into the right workflow."
              />
              <NotificationFeed items={inAppNotifications} />
            </section>
          ) : null}

          <section aria-labelledby="alerts-heading" className="space-y-8">
            <SectionHeader
              eyebrow="Member alerts"
              title="Escalations visible across the platform"
              description="Alert cards surface expiring memberships, unfinished assessments, and unread executive updates before they become support issues."
            />
            <AlertGrid items={memberAlerts} />
          </section>

          <section aria-labelledby="reminder-heading" className="space-y-8">
            <SectionHeader
              eyebrow="Reminder engine"
              title="Automations tuned to lifecycle moments"
              description="Reminder rules cover daily learning streaks, renewal protection, and re-engagement cadences while respecting channel preferences."
            />
            <div className="grid gap-4 lg:grid-cols-3">
              {reminderWorkflows.map((workflow) => (
                <article
                  key={workflow.title}
                  className="rounded-2xl border border-white/10 bg-slate-900/80 p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-bold text-white">{workflow.title}</h3>
                    <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-200">
                      {workflow.channel}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{workflow.message}</p>
                  <dl className="mt-5 space-y-2 text-sm text-slate-300">
                    <div className="flex justify-between gap-4">
                      <dt>Cadence</dt>
                      <dd className="font-semibold text-white">{workflow.cadence}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Audience</dt>
                      <dd className="text-right font-semibold text-white">{workflow.audience}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Schedule</dt>
                      <dd className="text-right font-semibold text-white">{workflow.scheduledFor}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="preferences-heading" className="space-y-8">
            <SectionHeader
              eyebrow="Preference management"
              title="Channel controls members can actually understand"
              description="Preference groups bundle consent, cadence, and accessibility-safe delivery expectations into one place for members and administrators."
            />
            <PreferenceGroups items={preferenceGroups} />
            <div className="flex flex-wrap gap-4">
              <Link
                href="/member/settings"
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500"
              >
                Open member settings
              </Link>
              <Link
                href="/settings"
                className="rounded-xl border border-white/20 px-5 py-3 font-semibold text-white hover:bg-white/5"
              >
                Review account settings
              </Link>
            </div>
          </section>

          {mode !== "notifications" ? (
            <section aria-labelledby="templates-heading" className="space-y-8">
              <SectionHeader
                eyebrow="Messaging templates"
                title="Reusable copy across email, SMS, and newsletter sends"
                description="Templates stay concise, scannable, and accessible while preserving a consistent voice across every delivery channel."
              />
              <TemplateGrid items={messageTemplates} />
            </section>
          ) : null}

          <section aria-labelledby="channels-heading" className="space-y-8">
            <SectionHeader
              eyebrow="Channel health"
              title="Responsive delivery with accessibility in mind"
              description="The platform keeps every communication mode visible, from SMS fallbacks to newsletter editions designed for readable mobile layouts."
            />
            <ChannelGrid items={channelHealth} />
          </section>
        </div>
      </section>
    </main>
  );
}
