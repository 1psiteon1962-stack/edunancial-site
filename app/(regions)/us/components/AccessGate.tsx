import { ReactNode } from "react";
import type { PlanCode } from "@/types/plan";
import { normalizePlan } from "@/types/plan";
import { useSession } from "@/lib/auth/useSession";

interface AccessGateProps {
  required?: PlanCode | PlanCode[];
  children: ReactNode;
}

export function AccessGate({ required, children }: AccessGateProps) {
  const { user } = useSession();

  const userPlan: PlanCode = normalizePlan(user?.plan);

  if (!required) return <>{children}</>;

  const allowed = Array.isArray(required)
    ? required
    : [required];

  if (!allowed.includes(userPlan)) {
    return null;
  }

  return <>{children}</>;
}
