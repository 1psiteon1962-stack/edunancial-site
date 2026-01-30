"use client";

import { useState } from "react";
import { normalizePlan } from "@/app/lib/plans";
import type { PlanCode } from "@/types/plans";

export default function LoginPage() {
  const [plan, setPlan] = useState<PlanCode>("free");

  function handleSelect(value: string) {
    setPlan(normalizePlan(value));
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Select Your Plan</h1>

      <select
        value={plan}
        onChange={(e) => handleSelect(e.target.value)}
        style={{ padding: 10, marginTop: 20 }}
      >
        <option value="free">Free</option>
        <option value="starter">Starter</option>
        <option value="pro">Pro</option>
        <option value="growth">Growth</option>
        <option value="elite">Elite</option>
        <option value="enterprise">Enterprise</option>
      </select>

      <p style={{ marginTop: 20 }}>
        Current Plan: <strong>{plan}</strong>
      </p>
    </main>
  );
}
