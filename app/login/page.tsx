"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth/useSession";
import { normalizePlan } from "@/types/plan";
import type { PlanCode } from "@/types/plan";

export default function LoginPage() {
  const { session, loading, setSession } = useSession();

  const [plan, setPlan] = useState<PlanCode>("free");

  if (loading) {
    return <div>Loading…</div>;
  }

  const handleLogin = () => {
    setSession({
      user: {
        planCode: plan,
      },
    });
  };

  return (
    <div>
      <h1>Login</h1>

      <select
        value={plan}
        onChange={(e) => setPlan(normalizePlan(e.target.value))}
      >
        <option value="free">Free</option>
        <option value="pro">Pro</option>
        <option value="enterprise">Enterprise</option>
      </select>

      <button onClick={handleLogin}>Login</button>

      {session && (
        <pre>{JSON.stringify(session, null, 2)}</pre>
      )}
    </div>
  );
}
