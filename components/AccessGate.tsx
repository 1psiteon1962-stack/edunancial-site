// components/AccessGate.tsx

import React from "react";
import { PlanCode } from "@/types/plan";

export type AccessGateProps = {
  children: React.ReactNode;
  requiredPlan: PlanCode;
};

export default function AccessGate({
  children,
  requiredPlan
}: AccessGateProps) {
  // TEMP: until auth is wired, allow build + render everything
  // Later this will enforce subscriptions properly.
  return <>{children}</>;
}
