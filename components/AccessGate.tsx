// components/AccessGate.tsx
"use client";

import React from "react";
import { normalizePlan, type PlanCode } from "@/app/lib/plans";

type Props = {
  plan?: string;
  children: React.ReactNode;
};

/**
 * AccessGate (Default Export)
 * --------------------------------------------
 * Netlify Fix:
 * Pages import this as:
 *
 *   import AccessGate from "@/components/AccessGate"
 *
 * Therefore this component MUST have a default export.
 */
const AccessGate = ({ plan, children }: Props) => {
  // Normalize plan safely
  const normalized: PlanCode = normalizePlan(plan || "free");

  // TODO: Replace with real access logic later.
  // For now, always allow access so builds succeed.
  return <>{children}</>;
};

export default AccessGate;
