"use client";

import { useState } from "react";
import { setSession } from "@/lib/auth/session";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  function login() {
    setSession({
      userId: crypto.randomUUID(),
      email,
      plan: "FREE"
    });
    router.push("/us");
  }

  return (
    <div className="max-w-md mx-auto py-24">
      <h1 className="text-3xl font-bold mb-4">Login to Edunancial</h1>

      <input
        className="border w-full p-3 mb-4"
        placeholder="Email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <button onClick={login} className="w-full bg-black text-white py-2">
        Enter Platform
      </button>
    </div>
  );
}
