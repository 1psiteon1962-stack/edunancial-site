import Link from "next/link";
import type {
  AnnouncementItem,
  ChannelHealth,
  CommunicationMetric,
  MemberAlert,
  MessageTemplate,
  NewsletterIssue,
  OutreachAction,
  PreferenceGroup,
  SmsHook,
} from "@/lib/communications/platform";
import type { Notification } from "@/types/notifications";

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">{title}</h2>
      <p className="mt-4 text-base text-slate-300 md:text-lg">{description}</p>
    </div>
  );
}

export function MetricGrid({ items }: { items: CommunicationMetric[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-2xl border border-white/10 bg-slate-900/80 p-6"
        >
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{item.label}</p>
          <p className="mt-4 text-4xl font-black text-white">{item.value}</p>
          <p className="mt-3 text-sm text-slate-300">{item.detail}</p>
        </article>
      ))}
    </div>
  );
}

export function AnnouncementCards({ items }: { items: AnnouncementItem[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="flex h-full flex-col rounded-2xl border border-white/10 bg-slate-900/80 p-6"
        >
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <StatusBadge label={item.priority} />
            <span>{item.audience}</span>
            <span aria-hidden="true">•</span>
            <span>{item.window}</span>
          </div>
          <h3 className="mt-4 text-2xl font-bold text-white">{item.title}</h3>
          <p className="mt-3 flex-1 text-sm text-slate-300">{item.summary}</p>
          <Link
            href={item.href}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500"
          >
            {item.callToAction}
          </Link>
        </article>
      ))}
    </div>
  );
}

export function ChannelGrid({ items }: { items: ChannelHealth[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map((item) => (
        <article
          key={item.name}
          className="rounded-2xl border border-white/10 bg-slate-900/80 p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-white">{item.name}</h3>
            <StatusBadge label={item.status} />
          </div>
          <p className="mt-4 text-sm uppercase tracking-[0.25em] text-slate-400">
            {item.type} • {item.throughput}
          </p>
          <p className="mt-3 text-sm text-slate-300">{item.detail}</p>
        </article>
      ))}
    </div>
  );
}

export function NotificationFeed({ items }: { items: Notification[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-white/10 bg-slate-900/80 p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <StatusBadge label={item.priority} />
                <span>{item.category}</span>
                <span aria-hidden="true">•</span>
                <span>{item.channel}</span>
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-300">{item.message}</p>
            </div>
            <div className="text-right text-sm text-slate-400">
              <p>{new Date(item.createdAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}</p>
              <p className="mt-2 font-semibold text-white">
                {item.read ? "Read" : "Unread"}
              </p>
            </div>
          </div>
          {item.action ? (
            <Link
              href={item.action.href}
              className="mt-5 inline-flex rounded-xl border border-blue-400 px-4 py-2 text-sm font-semibold text-blue-200 hover:bg-blue-500/10"
            >
              {item.action.label}
            </Link>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export function AlertGrid({ items }: { items: MemberAlert[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-white/10 bg-slate-900/80 p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white">{item.member}</h3>
            <StatusBadge label={item.severity} />
          </div>
          <p className="mt-4 text-sm text-slate-300">{item.trigger}</p>
          <dl className="mt-5 space-y-2 text-sm text-slate-300">
            <div className="flex justify-between gap-4">
              <dt>Channel</dt>
              <dd className="font-semibold text-white">{item.channel}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Status</dt>
              <dd className="text-right font-semibold text-white">{item.status}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}

export function PreferenceGroups({ items }: { items: PreferenceGroup[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {items.map((group) => (
        <article
          key={group.title}
          className="rounded-2xl border border-white/10 bg-slate-900/80 p-6"
        >
          <h3 className="text-xl font-bold text-white">{group.title}</h3>
          <p className="mt-3 text-sm text-slate-300">{group.description}</p>
          <ul className="mt-6 space-y-3">
            {group.items.map((item) => (
              <li
                key={item.label}
                className="rounded-xl border border-white/10 bg-slate-950/70 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{item.label}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {item.channel} • {item.cadence}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.enabled
                        ? "bg-emerald-500/15 text-emerald-200"
                        : "bg-slate-700 text-slate-200"
                    }`}
                  >
                    {item.enabled ? "On" : "Off"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

export function TemplateGrid({ items }: { items: MessageTemplate[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-white/10 bg-slate-900/80 p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-white">{item.name}</h3>
            <StatusBadge label={item.channel} />
          </div>
          <p className="mt-3 text-sm font-semibold text-blue-200">{item.subject}</p>
          <p className="mt-3 text-sm text-slate-300">{item.description}</p>
          <dl className="mt-5 space-y-2 text-sm text-slate-300">
            <div className="flex justify-between gap-4">
              <dt>Owner</dt>
              <dd className="font-semibold text-white">{item.owner}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Variables</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {item.variables.map((variable) => (
                  <span
                    key={variable}
                    className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200"
                  >
                    {variable}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}

export function NewsletterGrid({ items }: { items: NewsletterIssue[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-white/10 bg-slate-900/80 p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-white">{item.title}</h3>
            <StatusBadge label={item.status} />
          </div>
          <p className="mt-3 text-sm text-slate-300">{item.goal}</p>
          <dl className="mt-5 space-y-2 text-sm text-slate-300">
            <div className="flex justify-between gap-4">
              <dt>Audience</dt>
              <dd className="text-right font-semibold text-white">{item.audience}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Send window</dt>
              <dd className="text-right font-semibold text-white">{item.sendWindow}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}

export function SmsHookTable({ items }: { items: SmsHook[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/80">
      <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-300">
        <thead className="bg-slate-950/70 text-xs uppercase tracking-[0.25em] text-slate-400">
          <tr>
            <th className="px-4 py-4">Event</th>
            <th className="px-4 py-4">Destination</th>
            <th className="px-4 py-4">Status</th>
            <th className="px-4 py-4">Purpose</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-4 font-semibold text-white">{item.event}</td>
              <td className="px-4 py-4 font-mono text-xs text-blue-200">{item.destination}</td>
              <td className="px-4 py-4">
                <StatusBadge label={item.status} />
              </td>
              <td className="px-4 py-4">{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SubscriberTable({
  rows,
}: {
  rows: Array<{
    id: string;
    name: string;
    location: string;
    source: string;
    status: string;
    value: string;
  }>;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/80">
      <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-300">
        <thead className="bg-slate-950/70 text-xs uppercase tracking-[0.25em] text-slate-400">
          <tr>
            <th className="px-4 py-4">Member</th>
            <th className="px-4 py-4">Location</th>
            <th className="px-4 py-4">Source</th>
            <th className="px-4 py-4">Status</th>
            <th className="px-4 py-4">LTV</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-4 font-semibold text-white">{row.name}</td>
              <td className="px-4 py-4">{row.location}</td>
              <td className="px-4 py-4">{row.source}</td>
              <td className="px-4 py-4">
                <StatusBadge label={row.status} />
              </td>
              <td className="px-4 py-4 text-white">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ActionGrid({ items }: { items: OutreachAction[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 hover:border-blue-400"
        >
          <h3 className="text-xl font-bold text-white">{item.title}</h3>
          <p className="mt-3 text-sm text-slate-300">{item.description}</p>
        </Link>
      ))}
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  const tone = label.toLowerCase();
  const className =
    tone === "critical" || tone === "fallback"
      ? "bg-red-500/15 text-red-200"
      : tone === "high" || tone === "monitoring" || tone === "queued"
        ? "bg-amber-500/15 text-amber-200"
        : tone === "healthy" || tone === "live" || tone === "scheduled" || tone === "ready"
          ? "bg-emerald-500/15 text-emerald-200"
          : "bg-blue-500/15 text-blue-200";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${className}`}>
      {label}
    </span>
  );
}
