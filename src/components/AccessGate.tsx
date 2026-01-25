// src/components/AccessGate.tsx

import React from "react";

export type AccessGateProps = {
  children: React.ReactNode;
  requiredPlan: string;
};

export default function AccessGate({
  children,
  requiredPlan,
}: AccessGateProps) {
  // TEMP DEFAULT UNTIL AUTH EXISTS
  const currentPlan = "free";

  const allowed =
    currentPlan === requiredPlan || currentPlan !== "free";

  if (!allowed) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Upgrade Required</h2>
        <p>This page requires the {requiredPlan} plan.</p>
      </div>
    );
  }

  return <>{children}</>;
}
