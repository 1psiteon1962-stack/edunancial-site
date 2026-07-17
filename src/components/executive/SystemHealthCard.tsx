import type { HealthStatus } from "@/lib/executive/types";

interface Props {
  name: string;
  status: HealthStatus;
  latencyMs?: number | null;
}

const STATUS_CONFIG: Record<HealthStatus, { dot: string; label: string; bg: string }> = {
  healthy: { dot: "bg-green-400", label: "Healthy", bg: "border-green-500/30" },
  degraded: { dot: "bg-yellow-400", label: "Degraded", bg: "border-yellow-500/30" },
  down: { dot: "bg-red-500", label: "Down", bg: "border-red-500/30" },
  unknown: { dot: "bg-slate-500", label: "Unknown", bg: "border-slate-600" },
};

export default function SystemHealthCard({ name, status, latencyMs }: Props) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div className={`rounded-xl border ${cfg.bg} bg-[#101a2f] p-5`}>
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${cfg.dot}`} />
        <span className="font-semibold">{name}</span>
      </div>
      <p className={`mt-2 text-sm font-bold ${status === "healthy" ? "text-green-400" : status === "down" ? "text-red-400" : "text-slate-300"}`}>
        {cfg.label}
      </p>
      {latencyMs != null && (
        <p className="mt-1 text-xs text-slate-500">{latencyMs}ms</p>
      )}
    </div>
  );
}
