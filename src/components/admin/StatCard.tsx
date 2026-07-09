import type { ReactNode } from "react";

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down";
  icon?: ReactNode;
  className?: string;
}

export default function StatCard({
  title,
  value,
  change,
  changeType,
  icon,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#101a2f] p-6 ${className}`}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        {icon && <span className="text-blue-400" aria-hidden="true">{icon}</span>}
      </div>

      <h2 className="mt-3 text-3xl font-black text-white">{value}</h2>

      {change && (
        <div
          className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
            changeType === "down"
              ? "bg-red-500/10 text-red-400"
              : "bg-green-500/10 text-green-400"
          }`}
        >
          <span aria-hidden="true">{changeType === "down" ? "▼" : "▲"}</span>
          <span>
            {change}
            <span className="sr-only">
              {changeType === "down" ? " decrease" : " increase"}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
