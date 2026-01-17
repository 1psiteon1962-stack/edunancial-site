// components/AccessGate.tsx

"use client";

import React from "react";
import type { PlanCode } from "@/types/plan";
import { canAccess } from "@/lib/access/canAccess";
import { useUser } from "@/lib/auth/useUser";

type Props = {
  required: PlanCode;
  children: React.ReactNode;
};

export function AccessGate({ required, children }: Props) {
  const { user, plan, loading } = useUser();

  if (loading) return null;

  // If not logged in, treat as free
  const effectivePlan: PlanCode = (plan ?? "free") as PlanCode;

  if (!canAccess(effectivePlan, required)) {
    return (
      <div
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: 12,
          padding: 16,
          background: "white",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 18 }}>
          Upgrade required
        </div>
        <p style={{ marginTop: 8, opacity: 0.85 }}>
          This section requires <b>{required}</b> access.
        </p>
        {!user ? (
          <p style={{ marginTop: 0, opacity: 0.85 }}>
            Please log in to continue.
          </p>
        ) : null}
      </div>
    );
  }

  return <>{children}</>;
}

export default AccessGate;
