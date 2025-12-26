"use client";

import { ReactNode } from "react";
import { MembershipLevel, getMembershipLevel } from "@/lib/membership";

const ORDER: MembershipLevel[] = ["free", "Builder", "Foundation", "Visionary"];

function meets(current: MembershipLevel, required: MembershipLevel) {
  return ORDER.indexOf(current) >= ORDER.indexOf(required);
}

export default function MembershipGate({
  required,
  children,
}: {
  required: MembershipLevel;
  children: ReactNode;
}) {
  const current = getMembershipLevel();

  if (!meets(current, required)) {
    return (
      <section style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: 10 }}>
        <h3>Locked</h3>
        <p>
          This tool requires: <strong>{required}</strong>. Your current level: <strong>{current}</strong>.
        </p>
        <p>
          Go to <a href="/membership">Membership</a> to unlock.
        </p>
      </section>
    );
  }

  return <>{children}</>;
}
