// components/AccessGate.tsx

import React from "react";
import { PlanCode } from "@/types/plans";

export type AccessGateProps = {
  children: React.ReactNode;
  requiredPlan: PlanCode;
};

export default function AccessGate({
  children,
  requiredPlan,
}: AccessGateProps) {
  return <>{children}</>;
}
