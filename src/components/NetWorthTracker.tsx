"use client";

import { useState } from "react";

export default function NetWorthTracker() {
  const [assets, setAssets] = useState(10000);
  const [debts, setDebts] = useState(2000);

  const netWorth = assets - debts;

  return (
    <section style={{ padding: "40px", border: "1px solid #ddd", borderRadius: "12px", maxWidth: "700px", margin: "40px auto", fontFamily: "Arial, sans-serif", lineHeight: 1.7 }}>
      <h2>Net Worth Tracker</h2>

      <p>
        Track the difference between what you own and what you owe.
      </p>

      <label>Total Assets</label>
      <input type="number" value={assets} onChange={(e) => setAssets(Number(e.target.value))} />

      <br />
      <br />

      <label>Total Debts</label>
      <input type="number" value={debts} onChange={(e) => setDebts(Number(e.target.value))} />

      <h3>Estimated Net Worth</h3>
      <p>${netWorth.toFixed(2)}</p>
    </section>
  );
}
