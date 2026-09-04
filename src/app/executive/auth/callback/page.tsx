"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ExecutiveMagicLinkCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get("access_token");
    if (!token) {
      setError("This secure email link is missing its sign-in token. Request a new link.");
      return;
    }

    void fetch("/api/executive/auth/magic-link/verify", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (response) => {
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error ?? "Secure email sign-in failed.");
      history.replaceState(null, "", "/executive/auth/callback");
      router.replace("/admin/video-studio");
      router.refresh();
    }).catch((reason) => setError(reason instanceof Error ? reason.message : "Secure email sign-in failed."));
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08101f] px-6 text-white">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-black">Secure owner sign-in</h1>
        <p className="mt-4 text-slate-300">{error ?? "Verifying your one-time email link…"}</p>
      </div>
    </main>
  );
}
