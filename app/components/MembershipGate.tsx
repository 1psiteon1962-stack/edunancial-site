"use client";

import React from "react";

type MembershipGateProps = {
  required: string;
  children: React.ReactNode;
};

export default function MembershipGate({
  required,
  children,
}: MembershipGateProps) {
  // TEMP: hardcoded allow until auth is wired
  const hasAccess = true;

  if (!hasAccess) {
    return (
      <section
        style={{
          padding: "2rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          background: "#fafafa",
        }}
      >
        <h2>Membership Required</h2>
        <p>
          This section requires the <strong>{required}</strong> membership tier.
        </p>
      </section>
    );
  }

  return <>{children}</>;
}
