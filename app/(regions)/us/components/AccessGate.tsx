"use client";

import { ReactNode, useEffect, useState } from "react";
import { DEFAULT_PLAN, hasAccess, isPlanCode, PLANS } from "@/types/plan";
import type { PlanCode } from "@/types/plan";
import Link from "next/link";

type Props = {
  required: PlanCode;
  children: ReactNode;
};

function getStoredPlan(): PlanCode {
  if (typeof window === "undefined") return DEFAULT_PLAN;

  const raw = window.localStorage.getItem("edunancial_plan");

  if (raw && isPlanCode(raw)) {
    return raw;
  }

  return DEFAULT_PLAN;
}

export default function AccessGate({ required, children }: Props) {
  const [plan, setPlan] = useState<PlanCode>(DEFAULT_PLAN);

  useEffect(() => {
    setPlan(getStoredPlan());
  }, []);

  if (hasAccess(plan, required)) {
    return <>{children}</>;
  }

  const requiredPlan = PLANS[required];

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "80px auto",
        padding: 40,
        border: "1px solid #ddd",
        borderRadius: 12,
        textAlign: "center",
        background: "#fafafa"
      }}
    >
      <h2>Upgrade Required</h2>
      <p style={{ fontSize: 18 }}>
        This section requires the <b>{requiredPlan.label}</b> plan.
      </p>

      <p style={{ marginTop: 20 }}>
        You are currently on <b>{PLANS[plan].label}</b>.
      </p>

      <Link
        href="/us/pay"
        style={{
          display: "inline-block",
          marginTop: 30,
          padding: "14px 28px",
          background: "#000",
          color: "#fff",
          borderRadius: 8,
          textDecoration: "none",
          fontWeight: 600
        }}
      >
        Upgrade Now
      </Link>
    </div>
  );
}
