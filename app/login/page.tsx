"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth/useSession";
import { normalizePlan } from "@/types/plan";
import type { PlanCode } from "@/types/plan";

export default function LoginPage() {
  const { session, loading, setSession } = useSession();

  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<PlanCode>("free");

  if (loading) {
    return <div>Loading…</div>;
  }

  const handleLogin = () => {
    setSession({
      user: {
        email,
        planCode: plan,
      },
    });
  };

  return (
    <div>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

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
