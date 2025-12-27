"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect after successful action (payment, signup, etc.)
    router.push("/");
  }, [router]);

  // App Router pages MUST return JSX or null
  return null;
}
