"use client";

import type { ReactNode } from "react";
import { trackKPI } from "../../lib/kpi/client";

type TrackButtonProps = {
  children: ReactNode;
  event: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
  className?: string;
};

export default function TrackButton({
  children,
  event,
  label,
  value,
  metadata,
  className,
}: TrackButtonProps) {
  async function handleClick() {
    await trackKPI({
      event,
      label,
      value,
      metadata,
    });
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
