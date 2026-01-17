"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DiagnosticPage() {
  const router = useRouter();
  const [score, setScore] = useState<number | null>(null);

  function submit() {
    // Placeholder scoring logic (questions stay proprietary)
    const calculatedLevel = score ?? 2;
    router.push(`/us/tracks?level=${calculatedLevel}`);
  }

  return (
    <main>
      <h1>Financial Thinking Diagnostic</h1>
      <p>This helps identify your starting point.</p>

      <button onClick={() => setScore(1)}>Mostly reactive</button>
      <button onClick={() => setScore(3)}>Planning & investing</button>
      <button onClick={() => setScore(5)}>Building systems</button>

      <br /><br />
      <button onClick={submit}>Continue</button>
    </main>
  );
}
