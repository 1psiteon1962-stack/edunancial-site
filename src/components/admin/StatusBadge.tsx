export interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const STATUS_STYLES: Record<string, string> = {
  published: "bg-green-500/10 text-green-400 border-green-500/30",
  active: "bg-green-500/10 text-green-400 border-green-500/30",
  draft: "bg-gray-500/10 text-gray-300 border-gray-500/30",
  archived: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  suspended: "bg-red-500/10 text-red-400 border-red-500/30",
  critical: "bg-red-500/10 text-red-400 border-red-500/30",
  review: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/30",
};

const STATUS_ICON: Record<string, string> = {
  published: "●",
  active: "●",
  draft: "○",
  archived: "○",
  suspended: "✕",
  critical: "✕",
  review: "◐",
  warning: "◐",
  pending: "◐",
  scheduled: "◔",
  info: "ℹ",
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const key = status.toLowerCase();
  const style = STATUS_STYLES[key] ?? "bg-white/5 text-gray-300 border-white/10";
  const icon = STATUS_ICON[key] ?? "•";
  const sizeClasses = size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-3 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold capitalize ${style} ${sizeClasses}`}
    >
      <span aria-hidden="true">{icon}</span>
      {status}
    </span>
  );
}
