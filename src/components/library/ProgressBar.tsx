interface ProgressBarProps {
  percent: number;
  label?: string;
  size?: "sm" | "md";
}

export default function ProgressBar({ percent, label, size = "md" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const height = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-400">{label}</span>
          <span className="text-xs font-semibold text-white">{clamped}%</span>
        </div>
      )}
      <div
        className={`w-full ${height} rounded-full bg-slate-700 overflow-hidden`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
      >
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
