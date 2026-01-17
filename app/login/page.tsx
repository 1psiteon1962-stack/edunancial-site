"use client";

import React, { useState } from "react";
import { useSession } from "@/lib/auth/useSession";

export default function LoginPage() {
  const { session, loading, setSession, clearSession } = useSession();
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("free");

  if (loading) return null;

  return (
    <main style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <h1 style={{ fontSize: 30 }}>Login</h1>

      {session ? (
        <>
          <p>
            Logged in as <b>{session.email}</b> ({session.plan})
          </p>
          <button onClick={clearSession}>Clear session</button>
        </>
      ) : (
        <>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
          />

          <select value={plan} onChange={(e) => setPlan(e.target.value)}>
            <option value="free">free</option>
            <option value="starter">starter</option>
            <option value="founder">founder</option>
            <option value="pro">pro</option>
            <option value="elite">elite</option>
            <option value="enterprise">enterprise</option>
          </select>

          <button
            onClick={() =>
              setSession({
                email,
                plan,
              })
            }
          >
            Set session
          </button>
        </>
      )}
    </main>
  );
}
