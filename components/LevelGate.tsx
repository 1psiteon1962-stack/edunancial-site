/* components/LevelGate.tsx */
"use client";

import React, { ReactNode } from "react";

interface LevelGateProps {
  requiredLevel: number;
  children: ReactNode;
}

/**
 * TEMPORARY / SAFE LEVEL GATE
 * --------------------------------
 * This version is intentionally self-contained.
 * - No aliases (@/)
 * - No external lib dependencies
 * - No server/session coupling
 *
 * It allows the site to BUILD and DEPLOY.
 * Real access logic can be layered back in later.
 */
export default function LevelGate({
  requiredLevel,
  children,
}: LevelGateProps) {
  // 🔒 CURRENT DEFAULT ACCESS LEVEL
  // This keeps the site live while logic is added incrementally
  const userLevel = 1;

  if (userLevel < requiredLevel) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Upgrade Required
        </h2>
        <p className="text-gray-700">
          This content is available at a higher access level.
        </p>
      </section>
    );
  }

  return <>{children}</>;
}
