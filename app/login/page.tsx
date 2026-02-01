"use client";

import React, { useState } from "react";
import { normalizePlan, type PlanCode } from "@/app/lib/plans";

export default function LoginPage() {
  // ✅ PlanCode comes ONLY from lib/plans.ts
  const [plan, setPlan] = useState<PlanCode>("free");

  function handleSelect(value: string) {
    // ✅ normalizePlan GUARANTEES a PlanCode return
    const normalized: PlanCode = normalizePlan(value);
    setPlan(normalized);
  }

  return (
    <div style={{ padding: 32 }}>
      <h1>Login</h1>

      <p>Select your plan:</p>

      <select
        value={plan}
        onChange={(e) => handleSelect(e.target.value)}
        style={{ padding: 10, marginTop: 12 }}
      >
        <option value="free">Free</option>
        <option value="starter">Starter</option>
        <option value="growth">Growth</option>
        <option value="builder">Builder</option>
        <option value="pro">Pro</option>
        <option value="enterprise">Enterprise</option>
        <option value="elite">Elite</option>
      </select>

      <p style={{ marginTop: 20 }}>
        Current plan: <strong>{plan}</strong>
      </p>
    </div>
  );
}
