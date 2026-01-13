"use client";

import type { ReactNode } from "react";
import { canAccess, getActivePlan } from "../../../../lib/access";
import type { PlanTier } from "../../../../types/plan";
import { PLAN_LABELS } from "../../../../types/plan";

export default function AccessGate({
  required,
  children,
}: {
  required: PlanTier;
  children: ReactNode;
}) {
  const active = getActivePlan();
  const ok = canAccess(required, active);

  if (ok) return <>{children}</>;

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Locked</div>
      <div style={{ marginBottom: 12 }}>
        This section requires <b>{PLAN_LABELS[required]}</b>. Your current access is{" "}
        <b>{PLAN_LABELS[active]}</b>.
      </div>
      <a
        href="/us/pay"
        style={{
          display: "inline-block",
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #111",
          textDecoration: "none",
          fontWeight: 700,
        }}
      >
        Upgrade Access
      </a>
    </div>
  );
}
