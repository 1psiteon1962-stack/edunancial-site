"use client";

type CashFlowMapperProps = {
  region: string;
};

export default function CashFlowMapper({ region }: CashFlowMapperProps) {
  return (
    <section style={{ marginTop: "2rem" }}>
      <h2>Cash Flow Mapper — {region}</h2>
      <p>
        Visualize money coming in and out, focusing on survival-first cash flow
        before scaling strategies.
      </p>

      <ul>
        <li>Income sources</li>
        <li>Fixed vs variable expenses</li>
        <li>Net monthly position</li>
      </ul>
    </section>
  );
}
