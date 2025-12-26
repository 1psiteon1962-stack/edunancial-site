"use client";

import { useState } from "react";
import { Region } from "@/lib/core";
import { recordEvent } from "@/lib/metrics";

type Props = {
  region: Region;
};

export default function CashFlowMapper({ region }: Props) {
  const [income, setIncome] = useState("");
  const [fixedCosts, setFixedCosts] = useState("");
  const [variableCosts, setVariableCosts] = useState("");
  const [daysToIncome, setDaysToIncome] = useState("");

  function submit() {
    const i = Number(income || 0);
    const f = Number(fixedCosts || 0);
    const v = Number(variableCosts || 0);
    const d = Number(daysToIncome || 0);

    recordEvent({
      region,
      name: "cashflow_submit",
      value: Math.max(0, i - f - v),
      meta: {
        income: String(i),
        fixedCosts: String(f),
        variableCosts: String(v),
        daysToIncome: String(d),
      },
    });

    alert("Saved. Next step: pick 1 income action and execute today.");
  }

  return (
    <section style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: 10 }}>
      <h2>Cash-Flow Mapper</h2>
      <p>
        This is designed for speed: map cash in, cash out, and time-to-income.
        No predictions. No promises.
      </p>

      <div style={{ display: "grid", gap: "0.75rem", maxWidth: 420 }}>
        <label>
          Monthly income (local currency)
          <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} />
        </label>

        <label>
          Fixed costs (rent, phone, transport)
          <input type="number" value={fixedCosts} onChange={(e) => setFixedCosts(e.target.value)} />
        </label>

        <label>
          Variable costs (food, supplies)
          <input type="number" value={variableCosts} onChange={(e) => setVariableCosts(e.target.value)} />
        </label>

        <label>
          Days until you get paid (estimated)
          <input type="number" value={daysToIncome} onChange={(e) => setDaysToIncome(e.target.value)} />
        </label>

        <button onClick={submit}>Save & Generate Next Action</button>
      </div>

      <div style={{ marginTop: "1rem", fontSize: 14, opacity: 0.85 }}>
        <strong>Next action rule:</strong> Choose one offer + one delivery method + one payment method.
        Do 10 outreach messages today.
      </div>
    </section>
  );
}
