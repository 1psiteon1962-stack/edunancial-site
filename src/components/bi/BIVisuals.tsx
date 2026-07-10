import type {
  FunnelStep,
  OperationalEvent,
  PieSegment,
  SeriesPoint,
  TrendDirection,
} from "@/lib/bi/types";

function trendStyles(direction: TrendDirection) {
  if (direction === "down") {
    return {
      icon: "↓",
      className: "bg-red-500/15 text-red-200",
    };
  }

  if (direction === "neutral") {
    return {
      icon: "•",
      className: "bg-slate-500/20 text-slate-200",
    };
  }

  return {
    icon: "↑",
    className: "bg-emerald-500/15 text-emerald-200",
  };
}

export function TrendBadge({
  direction,
  delta,
}: {
  direction: TrendDirection;
  delta: string;
}) {
  const style = trendStyles(direction);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${style.className}`}
    >
      <span aria-hidden="true">{style.icon}</span>
      {delta}
    </span>
  );
}

export function LineChart({
  title,
  series,
  unit,
}: {
  title: string;
  series: SeriesPoint[];
  unit: string;
}) {
  const width = 640;
  const height = 220;
  const padding = 24;
  const maxValue = Math.max(...series.map((point) => point.value), 1);
  const minValue = Math.min(...series.map((point) => point.value), 0);
  const range = Math.max(maxValue - minValue, 1);

  const points = series
    .map((point, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(series.length - 1, 1);
      const y =
        height - padding - ((point.value - minValue) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <figure className="rounded-3xl border border-white/10 bg-[#10192e] p-6">
      <figcaption className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-sm text-slate-400">{unit}</p>
        </div>
      </figcaption>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-6 h-60 w-full"
        role="img"
        aria-label={title}
      >
        {[0, 1, 2, 3].map((step) => {
          const y = padding + (step * (height - padding * 2)) / 3;
          return (
            <line
              key={step}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              stroke="rgba(148, 163, 184, 0.18)"
              strokeWidth="1"
            />
          );
        })}

        <polyline
          fill="none"
          stroke="#38bdf8"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />

        {series.map((point, index) => {
          const x = padding + (index * (width - padding * 2)) / Math.max(series.length - 1, 1);
          const y =
            height - padding - ((point.value - minValue) / range) * (height - padding * 2);

          return (
            <g key={point.label}>
              <circle cx={x} cy={y} r="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
              <text x={x} y={height - 6} fill="#cbd5e1" fontSize="12" textAnchor="middle">
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

export function BarChart({
  title,
  series,
  unit,
}: {
  title: string;
  series: SeriesPoint[];
  unit: string;
}) {
  const maxValue = Math.max(...series.map((point) => point.value), 1);

  return (
    <figure className="rounded-3xl border border-white/10 bg-[#10192e] p-6">
      <figcaption>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-400">{unit}</p>
      </figcaption>

      <div className="mt-6 space-y-4">
        {series.map((point) => (
          <div key={point.label}>
            <div className="mb-2 flex items-center justify-between gap-4 text-sm text-slate-300">
              <span>{point.label}</span>
              <span>{point.value}</span>
            </div>
            <div className="h-3 rounded-full bg-slate-800">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
                style={{
                  width: `${(point.value / maxValue) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

export function PieChart({
  title,
  segments,
}: {
  title: string;
  segments: PieSegment[];
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  let offset = 0;

  return (
    <figure className="rounded-3xl border border-white/10 bg-[#10192e] p-6">
      <figcaption>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-400">Distribution by channel</p>
      </figcaption>

      <div className="mt-6 flex flex-col items-center gap-6 lg:flex-row lg:items-start">
        <svg viewBox="0 0 160 160" className="h-40 w-40" role="img" aria-label={title}>
          <g transform="translate(80 80) rotate(-90)">
            {segments.map((segment) => {
              const segmentLength = (segment.value / total) * circumference;
              const currentOffset = offset;
              offset += segmentLength;

              return (
                <circle
                  key={segment.label}
                  r={radius}
                  cx="0"
                  cy="0"
                  fill="transparent"
                  stroke={segment.color}
                  strokeWidth="22"
                  strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                  strokeDashoffset={-currentOffset}
                />
              );
            })}
          </g>
          <text x="80" y="76" textAnchor="middle" fill="#f8fafc" fontSize="18" fontWeight="700">
            {total}
          </text>
          <text x="80" y="98" textAnchor="middle" fill="#94a3b8" fontSize="12">
            total share
          </text>
        </svg>

        <ul className="w-full space-y-3">
          {segments.map((segment) => (
            <li
              key={segment.label}
              className="flex items-center justify-between gap-4 rounded-2xl bg-slate-900/70 px-4 py-3 text-sm"
            >
              <span className="inline-flex items-center gap-3 text-slate-200">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: segment.color }}
                  aria-hidden="true"
                />
                {segment.label}
              </span>
              <span className="font-semibold text-white">{segment.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}

export function FunnelChart({
  title,
  steps,
}: {
  title: string;
  steps: FunnelStep[];
}) {
  const maxValue = Math.max(...steps.map((step) => step.value), 1);

  return (
    <section className="rounded-3xl border border-white/10 bg-[#10192e] p-6">
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <div className="mt-6 space-y-4">
        {steps.map((step) => (
          <div key={step.label} className="rounded-2xl bg-slate-900/70 p-4">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-semibold text-white">{step.label}</span>
              <span className="text-slate-300">{step.conversion}</span>
            </div>
            <div className="mt-3 h-4 rounded-full bg-slate-800">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                style={{ width: `${(step.value / maxValue) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-slate-400">
              {step.value.toLocaleString()} members / sessions
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HeatMapPlaceholder() {
  const rows = [
    [0.3, 0.5, 0.7, 0.6, 0.4],
    [0.4, 0.8, 0.9, 0.7, 0.5],
    [0.2, 0.6, 0.75, 0.55, 0.45],
    [0.1, 0.3, 0.5, 0.65, 0.8],
  ];

  return (
    <section className="rounded-3xl border border-dashed border-cyan-500/40 bg-[#10192e] p-6">
      <h3 className="text-lg font-bold text-white">Heat map foundation</h3>
      <p className="mt-2 text-sm text-slate-400">
        Reserved component for cohort, geography, and engagement density reporting.
      </p>
      <div className="mt-6 grid grid-cols-5 gap-3">
        {rows.flatMap((row, rowIndex) =>
          row.map((value, columnIndex) => (
            <div
              key={`${rowIndex}-${columnIndex}`}
              className="aspect-square rounded-2xl border border-white/5"
              style={{
                backgroundColor: `rgba(34, 211, 238, ${value})`,
              }}
              aria-label={`Heat map cell ${rowIndex + 1}-${columnIndex + 1}`}
            />
          )),
        )}
      </div>
    </section>
  );
}

export function GeoPlaceholder() {
  return (
    <section className="rounded-3xl border border-dashed border-blue-500/40 bg-[#10192e] p-6">
      <h3 className="text-lg font-bold text-white">Geographic reporting foundation</h3>
      <p className="mt-2 text-sm text-slate-400">
        Future-ready container for regional overlays, territory drill-downs, and warehouse-fed maps.
      </p>
      <ul className="mt-6 space-y-3 text-sm text-slate-300">
        <li className="rounded-2xl bg-slate-900/70 px-4 py-3">Country, region, and city dimensions reserved</li>
        <li className="rounded-2xl bg-slate-900/70 px-4 py-3">Compatible with Power BI and Tableau geographic layers</li>
        <li className="rounded-2xl bg-slate-900/70 px-4 py-3">Supports future heat overlays for engagement and revenue density</li>
      </ul>
    </section>
  );
}

export function EventsTable({
  title,
  events,
}: {
  title: string;
  events: OperationalEvent[];
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#10192e]">
      <div className="border-b border-white/10 px-6 py-5">
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-900/70 text-slate-300">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">Event</th>
              <th scope="col" className="px-6 py-4 font-semibold">Status</th>
              <th scope="col" className="px-6 py-4 font-semibold">Owner</th>
              <th scope="col" className="px-6 py-4 font-semibold">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={`${event.event}-${event.timestamp}`} className="border-t border-white/5 text-slate-200">
                <td className="px-6 py-4">{event.event}</td>
                <td className="px-6 py-4">{event.status}</td>
                <td className="px-6 py-4">{event.owner}</td>
                <td className="px-6 py-4">{event.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
