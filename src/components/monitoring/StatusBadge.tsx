import { type ServiceStatus } from "@/lib/monitoring";

interface StatusBadgeProps {
  status: ServiceStatus | "firing" | "resolved" | "acknowledged";
  label?: string;
  size?: "sm" | "md";
}

const CONFIG: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  healthy:      { dot: "bg-emerald-400", bg: "bg-emerald-900/40 border border-emerald-700/60", text: "text-emerald-300", label: "Healthy"      },
  degraded:     { dot: "bg-amber-400 animate-pulse", bg: "bg-amber-900/40 border border-amber-700/60",   text: "text-amber-300",   label: "Degraded"     },
  down:         { dot: "bg-red-500 animate-pulse",   bg: "bg-red-900/40 border border-red-700/60",       text: "text-red-300",     label: "Down"         },
  unknown:      { dot: "bg-gray-400",  bg: "bg-gray-800/40 border border-gray-700/60",   text: "text-gray-400",    label: "Unknown"      },
  firing:       { dot: "bg-red-500 animate-pulse",   bg: "bg-red-900/40 border border-red-700/60",       text: "text-red-300",     label: "Firing"       },
  resolved:     { dot: "bg-emerald-400", bg: "bg-emerald-900/40 border border-emerald-700/60", text: "text-emerald-300", label: "Resolved" },
  acknowledged: { dot: "bg-blue-400",  bg: "bg-blue-900/40 border border-blue-700/60",   text: "text-blue-300",    label: "Acknowledged" },
};

export default function StatusBadge({ status, label, size = "md" }: StatusBadgeProps) {
  const cfg = CONFIG[status] ?? CONFIG.unknown;
  const displayLabel = label ?? cfg.label;
  const padding = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${cfg.bg} ${cfg.text} ${padding}`}
      role="status"
      aria-label={`Status: ${displayLabel}`}
    >
      <span className={`h-2 w-2 rounded-full flex-shrink-0 ${cfg.dot}`} aria-hidden="true" />
      {displayLabel}
    </span>
  );
}
