// components/AccessGate.tsx

import React from "react";

export interface AccessGateProps {
  children: React.ReactNode;

  // Support BOTH prop styles so builds never break again:
  required?: string;
  requiredPlan?: string;
}

export default function AccessGate({
  children,
  required,
  requiredPlan,
}: AccessGateProps) {
  // Normalize: allow either prop name
  const plan = requiredPlan ?? required ?? "starter";

  // For now, gate is open (later you can enforce paywalls)
  return (
    <div data-access-required={plan}>
      {children}
    </div>
  );
}
