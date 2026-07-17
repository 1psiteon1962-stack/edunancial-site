import type { KPIGoal } from "@/lib/executive/types";

interface Props {
  goal: KPIGoal;
}

export default function KPIGaugeCard({ goal }: Props) {
  const pct = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
  const barColor =
    pct >= 90 ? "bg-green-500" : pct >= 60 ? "bg-yellow-400" : pct >= 30 ? "bg-orange-400" : "bg-red-500";

  return (
    <div className="rounded-2xl bg-[#101a2f] p-6 border border-white/5">
      <p className="text-sm text-slate-400">{goal.label}</p>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-3xl font-black">
          {goal.current.toLocaleString()}
        </span>
        <span className="mb-1 text-sm text-slate-500">/ {goal.target.toLocaleString()} {goal.unit}</span>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-slate-800">
        <div className={`h-2 rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-right text-xs text-slate-500">{pct}%</p>
    </div>
  );
}
