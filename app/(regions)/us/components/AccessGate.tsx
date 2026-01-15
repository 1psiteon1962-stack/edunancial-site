"use client";

import React, { ReactNode, useMemo } from "react";
import {
  PlanCode,
  DEFAULT_PLAN,
  hasAccess,
  isPlanCode,
  PLANS,
} from "../../../../types/plan";

type AccessGateProps = {
  required: PlanCode;
  children: ReactNode;
  fallback?: ReactNode;
};

function getUserPlan(): PlanCode {
  if (typeof window === "undefined") return DEFAULT_PLAN;
  const raw = window.localStorage.getItem("edunancial_plan");
  if (isPlanCode(raw)) return raw;
  return DEFAULT_PLAN;
}

export default function AccessGate({
  required,
  children,
  fallback,
}: AccessGateProps) {
  const allowed = useMemo(() => {
    const userPlan = getUserPlan();
    return hasAccess(userPlan, required);
  }, [required]);

  if (allowed) return <>{children}</>;

  const plan = PLANS[required];

  return (
    <>
      {fallback ?? (
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            padding: 18,
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Upgrade Required</h3>
          <p>
            This section requires the <b>{plan.label}</b> plan.
          </p>

          <a
            href="/us/pay"
            style={{
              display: "inline-block",
              padding: "10px 14px",
              borderRadius: 8,
              background: "#2563eb",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Upgrade Now
          </a>
        </div>
      )}
    </>
  );
}
