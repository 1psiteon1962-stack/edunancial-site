"use client";

import React, { useState } from "react";
import { normalizePlan, type PlanCode } from "@/app/lib/plans";

export default function LoginPage() {
  // PlanCode now comes ONLY from the shared source of truth
  const [plan, setPlan] = useState<PlanCode>("free");

  function handleSelect(value: string) {
    // normalizePlan always returns a valid PlanCode
    setPlan(normalizePlan(value));
  }

  return (
    <div style={{ padding: 32 }}>
      <h1>Login</h1>

      <p>Select your plan:</p>

      <select
        value={plan}
        onChange={(e) => handleSelect(e.target.value)}
        style={{ padding: 8, marginTop: 12 }}
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
