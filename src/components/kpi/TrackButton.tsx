"use client";

import { trackKPI } from "@/lib/kpi/client";

export default function TrackButton({
  children,
  eventMeta,
}: {
  children: React.ReactNode;
  eventMeta?: Record<string, unknown>;
}) {
  return (
    <button
      onClick={() => trackKPI("cta_click", { metadata: eventMeta ?? {} })}
      style={{ padding: "10px 14px" }}
    >
      {children}
    </button>
  );
}
