"use client";

import React from "react";
import Link from "next/link";

/**
 * AccessGate
 * Wraps protected content and blocks users who do not meet the required plan.
 *
 * Usage:
 *   <AccessGate required="starter">
 *     ...protected content...
 *   </AccessGate>
 */

export type AccessGateProps = {
  required: string;
  userPlan?: string;
  children: React.ReactNode;
};

export function AccessGate({
  required,
  userPlan,
  children,
}: AccessGateProps) {
  // TEMP: Replace later with real auth/subscription logic
  const effectivePlan = userPlan ?? "free";

  if (effectivePlan !== required) {
    return (
      <div
        style={{
          maxWidth: 720,
          margin: "40px auto",
          padding: 24,
          border: "1px solid #ddd",
          borderRadius: 12,
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>
          🔒 Locked Content
        </h2>

        <p style={{ marginBottom: 16 }}>
          This page requires the <strong>{required}</strong> plan.
        </p>

        <p style={{ marginBottom: 24 }}>
          Please upgrade to unlock this content.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "10px 16px",
            borderRadius: 8,
            background: "black",
            color: "white",
            textDecoration: "none",
          }}
        >
          Return Home
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}

export default AccessGate;
