import { formatMetricValue } from "@/lib/operations/metrics";
import { MetricSample } from "@/lib/operations/types";
import StatusBadge from "@/components/operations/StatusBadge";

const trendLabel = {
  up: "↑",
  down: "↓",
  steady: "→",
};

export default function OperationsMetricCard({ metric }: { metric: MetricSample }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#101a2f] p-6 shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{metric.label}</p>
          <h3 className="mt-3 text-3xl font-black text-white">{formatMetricValue(metric)}</h3>
        </div>
        <StatusBadge tone={metric.status}>{metric.status}</StatusBadge>
      </div>
      <p className="mt-4 text-sm text-slate-300">{metric.description}</p>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
        <span>Trend {trendLabel[metric.trend]}</span>
        {metric.target ? <span>Target {metric.target}</span> : null}
      </div>
    </article>
  );
}
