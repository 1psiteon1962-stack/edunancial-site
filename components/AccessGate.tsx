// components/AccessGate.tsx

import { ReactNode } from "react";
import type { RequiredPlan } from "@/types/level";

interface AccessGateProps {
  required?: RequiredPlan | RequiredPlan[];
  children: ReactNode;
}

export default function AccessGate({ required, children }: AccessGateProps) {
  // TEMPORARY: allow all access
  // Later this can connect to auth/session logic safely
  return <>{children}</>;
}
