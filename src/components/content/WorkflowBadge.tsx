import type { ContentState } from "@/lib/content/types";

const STATE_STYLES: Record<ContentState, string> = {
  draft: "bg-slate-700 text-slate-100",
  inReview: "bg-amber-500/20 text-amber-200",
  approved: "bg-emerald-500/20 text-emerald-200",
  scheduled: "bg-blue-500/20 text-blue-200",
  published: "bg-cyan-500/20 text-cyan-200",
  archived: "bg-rose-500/20 text-rose-200",
};

const STATE_LABELS: Record<ContentState, string> = {
  draft: "Draft",
  inReview: "In Review",
  approved: "Approved",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
};

export function WorkflowBadge({ state }: { state: ContentState }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATE_STYLES[state]}`}>
      {STATE_LABELS[state]}
    </span>
  );
}
