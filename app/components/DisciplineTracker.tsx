"use client";

import { useState } from "react";
import { addDisciplineEntry } from "@/lib/discipline-store";

export default function DisciplineTracker() {
  const [amount, setAmount] = useState("");

  function submit() {
    if (!amount) return;

    addDisciplineEntry({
      date: new Date().toISOString(),
      unit: "silver-g",
      amount: Number(amount),
    });

    setAmount("");
    alert("Discipline logged.");
  }

  return (
    <section>
      <h2>Discipline Tracker</h2>
      <p>Track behavior. Not returns.</p>

      <input
        type="number"
        placeholder="grams"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={submit}>Log Discipline</button>
    </section>
  );
}
