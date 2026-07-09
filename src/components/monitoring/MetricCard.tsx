interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "stable";
  trendLabel?: string;
  status?: "good" | "warn" | "critical" | "neutral";
  description?: string;
}

const STATUS_COLORS = {
  good:     "border-emerald-700/40 bg-emerald-900/10",
  warn:     "border-amber-700/40 bg-amber-900/10",
  critical: "border-red-700/40 bg-red-900/10",
  neutral:  "border-white/10 bg-[#101a2f]",
};

const TREND_ICONS = {
  up:     { icon: "↑", color: "text-emerald-400" },
  down:   { icon: "↓", color: "text-red-400"     },
  stable: { icon: "→", color: "text-gray-400"    },
};

export default function MetricCard({
  title,
  value,
  unit,
  trend,
  trendLabel,
  status = "neutral",
  description,
}: MetricCardProps) {
  const borderBg = STATUS_COLORS[status];
  const trendCfg = trend ? TREND_ICONS[trend] : null;

  return (
    <div className={`rounded-2xl border p-6 ${borderBg}`} role="region" aria-label={title}>
      <p className="text-sm text-gray-400">{title}</p>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-3xl font-black text-white tabular-nums">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {unit && <span className="mb-1 text-sm text-gray-400">{unit}</span>}
      </div>
      {(trendCfg || trendLabel) && (
        <p className="mt-2 text-xs">
          {trendCfg && (
            <span className={`mr-1 font-bold ${trendCfg.color}`} aria-hidden="true">
              {trendCfg.icon}
            </span>
          )}
          <span className="text-gray-400">{trendLabel}</span>
        </p>
      )}
      {description && <p className="mt-2 text-xs text-gray-500">{description}</p>}
    </div>
  );
}
