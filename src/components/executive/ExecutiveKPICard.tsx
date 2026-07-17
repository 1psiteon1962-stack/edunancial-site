import type { DataStatus } from "@/lib/executive/types";

interface Props {
  label: string;
  value: string;
  status?: DataStatus;
  accent?: string;
  sublabel?: string;
}

const STATUS_BADGE: Record<DataStatus, string> = {
  live: "bg-green-500/20 text-green-300",
  demo: "bg-yellow-500/20 text-yellow-300",
  pending: "bg-slate-700 text-slate-400",
};

const STATUS_LABEL: Record<DataStatus, string> = {
  live: "Live",
  demo: "Demo",
  pending: "Pending",
};

export default function ExecutiveKPICard({ label, value, status = "pending", accent = "border-slate-700", sublabel }: Props) {
  return (
    <div className={`rounded-2xl border-l-4 ${accent} bg-[#101a2f] p-6`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-slate-400">{label}</p>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_BADGE[status]}`}>
          {STATUS_LABEL[status]}
        </span>
      </div>
      <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
      {sublabel && <p className="mt-1 text-xs text-slate-500">{sublabel}</p>}
    </div>
  );
}
