import Link from "next/link";
import {
  campaigns,
  channelHealth,
  communicationMetrics,
  memberAlerts,
  messageTemplates,
  newsletterIssues,
  outreachActions,
  preferenceGroups,
  reminderWorkflows,
  smsHooks,
  subscribers,
} from "@/lib/communications/platform";
import {
  ActionGrid,
  AlertGrid,
  ChannelGrid,
  MetricGrid,
  NewsletterGrid,
  PreferenceGroups,
  SectionHeader,
  SmsHookTable,
  SubscriberTable,
  TemplateGrid,
} from "@/components/communications/CommunicationBlocks";

export default function AdminCommunicationsHub({
  mode,
}: {
  mode: "overview" | "campaigns" | "newsletters" | "subscribers";
}) {
  const heading =
    mode === "campaigns"
      ? "Email + SMS operations"
      : mode === "newsletters"
        ? "Newsletter framework"
        : mode === "subscribers"
          ? "Subscriber intelligence"
          : "Communications command center";

  const description =
    mode === "campaigns"
      ? "Coordinate announcement sends, template governance, SMS fallback hooks, and reminder orchestration from one operational workspace."
      : mode === "newsletters"
        ? "Plan editorial calendars, segmented digests, and accessible mobile-first issues without leaving the admin console."
        : mode === "subscribers"
          ? "Review audience quality, preference coverage, and member alerts before launching the next campaign."
          : "A complete communications platform for announcements, in-app notifications, templates, reminders, newsletters, and preference-aware outreach.";

  const subscriberRows = subscribers.map((subscriber) => ({
    id: subscriber.id,
    name: `${subscriber.firstName} ${subscriber.lastName}`,
    location: `${subscriber.country} • ${subscriber.region}`,
    source: subscriber.source,
    status: subscriber.status,
    value: `$${subscriber.lifetimeValue.toLocaleString("en-US")}`,
  }));

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
              Admin communication tools
            </p>
            <h1 className="mt-5 text-4xl font-black md:text-6xl">{heading}</h1>
            <p className="mt-6 text-lg text-slate-300 md:text-xl">{description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/communications"
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500"
            >
              Communications hub
            </Link>
            <Link
              href="/admin/newsletters"
              className="rounded-xl border border-white/20 px-5 py-3 font-semibold text-white hover:bg-white/5"
            >
              Newsletters
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <MetricGrid items={communicationMetrics} />
        </div>

        <div className="mt-16 space-y-16">
          {mode === "overview" ? (
            <section aria-labelledby="actions-heading" className="space-y-8">
              <SectionHeader
                eyebrow="Command center"
                title="Fast paths for daily communication work"
                description="Core admin tools are grouped around launch readiness, subscriber review, and preference-aware member support."
              />
              <ActionGrid items={outreachActions} />
            </section>
          ) : null}

          <section aria-labelledby="campaigns-heading" className="space-y-8">
            <SectionHeader
              eyebrow="Email notification center"
              title="Campaign scheduling and lifecycle coverage"
              description="Campaign cards keep send status, conversion context, and audience size visible so administrators can launch the right message with confidence."
            />
            <div className="grid gap-4 xl:grid-cols-3">
              {campaigns.map((campaign) => (
                <article
                  key={campaign.id}
                  className="rounded-2xl border border-white/10 bg-slate-900/80 p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-bold text-white">{campaign.name}</h3>
                    <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold capitalize text-blue-200">
                      {campaign.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-blue-200">{campaign.subject}</p>
                  <dl className="mt-5 space-y-2 text-sm text-slate-300">
                    <div className="flex justify-between gap-4">
                      <dt>Audience</dt>
                      <dd className="font-semibold text-white">
                        {campaign.subscribers.toLocaleString("en-US")}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Opens / Clicks</dt>
                      <dd className="font-semibold text-white">
                        {campaign.opens}% / {campaign.clicks}%
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Conversions</dt>
                      <dd className="font-semibold text-white">{campaign.conversions}%</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Revenue</dt>
                      <dd className="font-semibold text-white">
                        ${campaign.revenue.toLocaleString("en-US")}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="sms-heading" className="space-y-8">
            <SectionHeader
              eyebrow="SMS notification hooks"
              title="Fallback paths for high-signal moments"
              description="SMS hooks are documented alongside their destinations so operators can audit escalation rules and preserve consent-aware delivery."
            />
            <SmsHookTable items={smsHooks} />
          </section>

          <section aria-labelledby="templates-heading" className="space-y-8">
            <SectionHeader
              eyebrow="Messaging templates"
              title="Shared content building blocks"
              description="Templates cover reminder emails, urgent SMS copy, and newsletter layouts while remaining readable, short, and reusable."
            />
            <TemplateGrid items={messageTemplates} />
          </section>

          {mode !== "campaigns" ? (
            <section aria-labelledby="newsletters-heading" className="space-y-8">
              <SectionHeader
                eyebrow="Newsletter framework"
                title="Editorial calendar with segmented delivery"
                description="Each issue documents its audience, timing, and goal so the newsletter program can scale without duplicating work."
              />
              <NewsletterGrid items={newsletterIssues} />
            </section>
          ) : null}

          <section aria-labelledby="reminders-heading" className="space-y-8">
            <SectionHeader
              eyebrow="Reminder engine"
              title="Automations spanning email, SMS, and in-app"
              description="Reminder workflows are visible to administrators so launches, renewals, and dormant learners all receive the right follow-up."
            />
            <div className="grid gap-4 lg:grid-cols-3">
              {reminderWorkflows.map((workflow) => (
                <article
                  key={workflow.title}
                  className="rounded-2xl border border-white/10 bg-slate-900/80 p-6"
                >
                  <h3 className="text-xl font-bold text-white">{workflow.title}</h3>
                  <p className="mt-3 text-sm text-slate-300">{workflow.message}</p>
                  <dl className="mt-5 space-y-2 text-sm text-slate-300">
                    <div className="flex justify-between gap-4">
                      <dt>Cadence</dt>
                      <dd className="font-semibold text-white">{workflow.cadence}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Channel</dt>
                      <dd className="font-semibold text-white">{workflow.channel}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Audience</dt>
                      <dd className="text-right font-semibold text-white">{workflow.audience}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>

          {mode === "subscribers" || mode === "overview" ? (
            <section aria-labelledby="subscribers-heading" className="space-y-8">
              <SectionHeader
                eyebrow="Subscriber registry"
                title="Audience quality and lifecycle visibility"
                description="Subscriber snapshots make it easier to export, segment, and prioritize high-value members before sending the next outreach sequence."
              />
              <SubscriberTable rows={subscriberRows} />
            </section>
          ) : null}

          {mode === "subscribers" || mode === "overview" ? (
            <section aria-labelledby="alerts-heading" className="space-y-8">
              <SectionHeader
                eyebrow="Member alerts"
                title="Who needs attention before the next send"
                description="Alert visibility helps administrators catch members at risk before they churn or miss critical milestones."
              />
              <AlertGrid items={memberAlerts} />
            </section>
          ) : null}

          <section aria-labelledby="preferences-heading" className="space-y-8">
            <SectionHeader
              eyebrow="Preference management"
              title="Consent-aware communication controls"
              description="Admin and member settings share the same preference model so every campaign respects channel permissions and delivery cadence."
            />
            <PreferenceGroups items={preferenceGroups} />
          </section>

          {mode === "overview" || mode === "campaigns" ? (
            <section aria-labelledby="channels-heading" className="space-y-8">
              <SectionHeader
                eyebrow="Operational status"
                title="Channel readiness across the platform"
                description="Health cards summarize throughput, status, and operating detail for email, SMS, in-app, and newsletter delivery."
              />
              <ChannelGrid items={channelHealth} />
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
