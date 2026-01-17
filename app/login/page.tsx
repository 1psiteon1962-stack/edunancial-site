// app/login/page.tsx

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
      <h1 style={{ fontSize: 30, marginBottom: 8 }}>Login</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Temporary local session login (client-side) for gating.
      </p>

      {session ? (
        <div style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 800 }}>Signed in</div>
          <div style={{ marginTop: 8, opacity: 0.85 }}>
            {session.email ?? "(no email)"} — plan: <b>{session.plan ?? "free"}</b>
          </div>
          <button
            style={{ marginTop: 12, padding: "10px 14px", fontWeight: 700 }}
            onClick={clearSession}
          >
            Clear session
          </button>
        </div>
      ) : (
        <div style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 16 }}>
          <label style={{ display: "block", fontWeight: 700 }}>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 10, border: "1px solid #ddd" }}
            placeholder="you@example.com"
          />

          <label style={{ display: "block", fontWeight: 700, marginTop: 12 }}>Plan</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 10, border: "1px solid #ddd" }}
          >
            <option value="free">free</option>
            <option value="starter">starter</option>
            <option value="founder">founder</option>
            <option value="pro">pro</option>
            <option value="elite">elite</option>
            <option value="enterprise">enterprise</option>
          </select>

          <button
            style={{ marginTop: 14, padding: "10px 14px", fontWeight: 800 }}
            onClick={() => setSession({ email, plan })}
            disabled={!email}
          >
            Set session
          </button>
        </div>
      )}
    </main>
  );
}
