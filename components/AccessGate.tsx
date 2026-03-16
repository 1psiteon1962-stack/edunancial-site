"use client";

import { ReactNode } from "react";

type AccessGateProps = {
  levelRequired?: "free" | "level-1" | "level-2" | "level-3";
  userLevel?: "free" | "level-1" | "level-2" | "level-3";
  children: ReactNode;
};

const LEVEL_ORDER = {
  free: 0,
  "level-1": 1,
  "level-2": 2,
  "level-3": 3
};

export default function AccessGate({
  levelRequired = "free",
  userLevel = "free",
  children
}: AccessGateProps) {

  if (LEVEL_ORDER[userLevel] < LEVEL_ORDER[levelRequired]) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Upgrade Required</h2>
        <p>
          This section requires <strong>{levelRequired}</strong> access.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
