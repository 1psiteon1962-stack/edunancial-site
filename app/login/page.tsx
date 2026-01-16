"use client";

import { useSession } from "@/lib/auth/session";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { session, loading, setSession } = useSession();
  const router = useRouter();

  if (loading) return null;

  if (session) {
    router.push("/");
    return null;
  }

  const handleLogin = () => {
    setSession({
      userId: "demo-user",
      email: "demo@edunancial.com",
      plan: "free",
    });
    router.push("/");
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login</button>
    </main>
  );
}
