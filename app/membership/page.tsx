"use client";

import { useState } from "react";
import { setMembershipLevel, MembershipLevel, getMembershipLevel } from "@/lib/membership";
import { recordEvent } from "@/lib/metrics";

export default function Page() {
  const [level, setLevel] = useState<MembershipLevel>(getMembershipLevel());

  function save(next: MembershipLevel) {
    setMembershipLevel(next);
    setLevel(next);
    recordEvent({ region: "US", name: "membership_set", meta: { level: next } });
    alert("Saved locally. (Payments/auth come later.)");
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 900, margin: "auto" }}>
      <h1>Membership</h1>
      <p>
        This is a simple local switch for gating tools while we build the full payment + account system.
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {(["free", "Builder", "Foundation", "Visionary"] as MembershipLevel[]).map((l) => (
          <button
            key={l}
            onClick={() => save(l)}
            style={{ padding: "0.6rem 1rem", borderRadius: 10, border: "1px solid #ddd" }}
          >
            Set: {l} {level === l ? "✓" : ""}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 16, fontSize: 14, opacity: 0.85 }}>
        Note: This does not process payments and does not verify identity yet.
      </div>
    </main>
  );
}
