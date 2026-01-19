// components/AccessGate.tsx

import type { ReactNode } from "react";
import { normalizePlan } from "@/types/plan";
import type { RequiredPlan } from "@/types/level";
import { canAccess } from "@/lib/access/canAccess";
import { useUser } from "@/lib/auth/useUser";

interface AccessGateProps {
  required?: RequiredPlan | RequiredPlan[];
  children: ReactNode;
}

export default function AccessGate({
  required,
  children,
}: AccessGateProps) {
  const { user } = useUser();

  if (!required) return <>{children}</>;

  const requiredPlans = Array.isArray(required)
    ? required
    : [required];

  const userPlan = normalizePlan(user?.plan);

  if (!canAccess(userPlan, requiredPlans)) {
    return null;
  }

  return <>{children}</>;
}
