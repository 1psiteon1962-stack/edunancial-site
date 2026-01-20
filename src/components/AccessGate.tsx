import type { ReactNode } from "react";

export type PlanCode = "starter" | "pro" | "premium" | "enterprise";

type AccessGateProps = {
  required: PlanCode;
  children: ReactNode;
};

export function AccessGate({ required, children }: AccessGateProps) {
  void required;
  return <>{children}</>;
}

export default AccessGate;
