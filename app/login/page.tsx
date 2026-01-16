"use client";

import React, { useState } from "react";
import type { UserSession } from "@/types/session";
import { useSession } from "@/lib/auth/useSession";

export default function LoginPage() {
  const { setSession } = useSession();
  const [email, setEmail] = useState("");

  function login() {
    const session: UserSession = {
      userId: crypto.randomUUID(),
      email,
      plan: "free",
    };
    setSession(session);
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold">Login</h1>

      <input
        className="border rounded px-3 py-2 w-full mt-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />

      <button
        className="mt-4 border rounded px-4 py-2 font-semibold"
        onClick={login}
        disabled={!email}
      >
        Continue
      </button>
    </div>
  );
}
