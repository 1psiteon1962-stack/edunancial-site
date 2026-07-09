import type { ReactNode } from "react";

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#0c1526] px-6 py-16 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl text-gray-500"
        aria-hidden="true"
      >
        📭
      </div>
      <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-gray-400">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
