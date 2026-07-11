type ToolStatus = "Available" | "Coming Soon";

type ToolCardProps = {
  name: string;
  description: string;
  status: ToolStatus;
  ctaLabel: string;
  icon: string;
  ctaHref?: string;
};

export default function ToolCard({
  name,
  description,
  status,
  ctaLabel,
  icon,
  ctaHref,
}: ToolCardProps) {
  const isAvailable = status === "Available";

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-700/70 bg-[#111827] p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15 text-xl"
        >
          {icon}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            isAvailable ? "bg-green-500/15 text-green-300" : "bg-slate-600/40 text-slate-300"
          }`}
        >
          {status}
        </span>
      </div>

      <h3 className="mt-5 text-2xl font-black text-white">{name}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>

      {isAvailable && ctaHref ? (
        <a
          href={ctaHref}
          className="mt-6 inline-flex w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
        >
          {ctaLabel}
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="mt-6 inline-flex w-fit cursor-not-allowed rounded-lg bg-slate-700 px-4 py-2 text-sm font-bold text-slate-200"
        >
          {ctaLabel}
        </button>
      )}
    </article>
  );
}
