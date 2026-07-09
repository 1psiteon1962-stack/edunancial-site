import React from "react";
import { AlertSeverity, HealthStatus, LogSeverity } from "@/lib/operations/types";

type BadgeTone = HealthStatus | AlertSeverity | LogSeverity | "stub" | "ready" | "demo";

const badgeToneClasses: Record<BadgeTone, string> = {
  healthy: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
  warning: "bg-amber-500/15 text-amber-100 border-amber-400/30",
  critical: "bg-rose-500/15 text-rose-100 border-rose-400/30",
  info: "bg-sky-500/15 text-sky-100 border-sky-400/30",
  error: "bg-rose-500/15 text-rose-100 border-rose-400/30",
  stub: "bg-slate-500/15 text-slate-200 border-slate-400/30",
  ready: "bg-blue-500/15 text-blue-100 border-blue-400/30",
  demo: "bg-violet-500/15 text-violet-100 border-violet-400/30",
};

export default function StatusBadge({ tone, children }: { tone: BadgeTone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${badgeToneClasses[tone]}`}>
      {children}
    </span>
  );
}
