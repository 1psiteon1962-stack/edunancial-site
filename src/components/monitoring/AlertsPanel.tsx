import { type Alert } from "@/lib/alerting";
import StatusBadge from "./StatusBadge";

interface AlertsPanelProps {
  alerts: Alert[];
  title?: string;
  maxItems?: number;
}

const SEVERITY_COLORS: Record<Alert["severity"], string> = {
  critical: "border-l-4 border-red-600",
  high:     "border-l-4 border-amber-500",
  medium:   "border-l-4 border-yellow-600",
  low:      "border-l-4 border-blue-500",
  info:     "border-l-4 border-gray-500",
};

function relativeTime(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60)   return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400)return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function AlertsPanel({ alerts, title = "Recent Alerts", maxItems = 10 }: AlertsPanelProps) {
  const visible = alerts.slice(0, maxItems);

  return (
    <section aria-label={title}>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
        {title}
      </h3>
      {visible.length === 0 ? (
        <p className="text-sm text-gray-500 py-4 text-center">No alerts</p>
      ) : (
        <ul className="space-y-2" role="list">
          {visible.map((alert) => (
            <li
              key={alert.id}
              className={`rounded-r-xl bg-[#101a2f] p-3 ${SEVERITY_COLORS[alert.severity]}`}
              role="listitem"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{alert.ruleName}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{alert.message}</p>
                  <p className="text-xs text-gray-600 mt-1">{alert.service} · {relativeTime(alert.firedAt)}</p>
                </div>
                <StatusBadge status={alert.status as Parameters<typeof StatusBadge>[0]["status"]} size="sm" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
