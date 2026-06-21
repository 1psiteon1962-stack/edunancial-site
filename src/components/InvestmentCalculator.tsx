"use client";

import { useState } from "react";

export default function InvestmentCalculator() {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);

  const futureValue = amount * Math.pow(1 + rate / 100, years);
  const gain = futureValue - amount;

  return (
    <section style={{ padding: "40px", border: "1px solid #ddd", borderRadius: "12px", maxWidth: "700px", margin: "40px auto", fontFamily: "Arial, sans-serif", lineHeight: 1.7 }}>
      <h2>Investment Calculator</h2>

      <p>
        This calculator is for financial literacy purposes only. It does not provide
        investment advice or recommendations.
      </p>

      <label>Initial Amount</label>
      <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />

      <br />
      <br />

      <label>Estimated Annual Return %</label>
      <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} />

      <br />
      <br />

      <label>Years</label>
      <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />

      <h3>Estimated Future Value</h3>
      <p>${futureValue.toFixed(2)}</p>

      <h3>Estimated Gain</h3>
      <p>${gain.toFixed(2)}</p>
    </section>
  );
}
