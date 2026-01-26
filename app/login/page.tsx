// app/login/page.tsx

"use client";

import React, { useState } from "react";
import { normalizePlan } from "@/app/lib/plans";
import type { PlanCode } from "@/types/plan";

export default function LoginPage() {
  const [plan, setPlan] = useState<PlanCode>("free");

  function handleSelect(value: string) {
    setPlan(normalizePlan(value));
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      <div className="w-full max-w-sm space-y-4">
        <label className="block font-medium">
          Select Plan
        </label>

        <select
          className="w-full border rounded p-2"
          onChange={(e) => handleSelect(e.target.value)}
        >
          <option value="free">Free</option>
          <option value="starter">Starter</option>
          <option value="builder">Builder</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>

        <p className="text-sm text-gray-600">
          Current plan: <strong>{plan}</strong>
        </p>
      </div>
    </main>
  );
}
