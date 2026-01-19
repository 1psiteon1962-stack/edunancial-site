import { ReactNode } from "react";
import type { PlanCode } from "@/types/plans";
import { useSession } from "@/lib/auth/useSession";

/**
 * These MUST match PlanCode exactly (lowercase).
 */
const SAFE_PLANS: readonly PlanCode[] = [
  "free",
  "starter",
  "basic",
  "pro",
  "enterprise",
];

interface AccessGateProps {
  required?: PlanCode | readonly PlanCode[];
  children: ReactNode;
}

function canAccess(
  userPlan: PlanCode,
  allowed: readonly PlanCode[]
): boolean {
  return allowed.includes(userPlan);
}

export default function AccessGate({
  required,
  children,
}: AccessGateProps) {
  const { user } = useSession();

  // No restriction
  if (!required) {
    return <>{children}</>;
  }

  const userPlan: PlanCode = user?.plan ?? "free";

  const requiredPlans = Array.isArray(required)
    ? required
    : [required];

  if (!canAccess(userPlan, requiredPlans)) {
    return null;
  }

  return <>{children}</>;
}
