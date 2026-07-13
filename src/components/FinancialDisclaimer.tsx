import {
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_METHODS_CLARIFICATION,
  EDUNANCIAL_PUBLIC_DISCLAIMER,
} from "@/lib/positioning";

export default function FinancialDisclaimer() {
  return (
    <section
      style={{
        padding: "30px",
        background: "#fffbe6",
        border: "1px solid #ddd",
        marginTop: "50px",
      }}
    >
      <h3>Important Disclaimer</h3>

      <p>{EDUNANCIAL_IDENTITY}</p>

      <p>{EDUNANCIAL_PUBLIC_DISCLAIMER}</p>

      <p>{EDUNANCIAL_METHODS_CLARIFICATION}</p>

      <p>
        Edunancial does not provide financial, investment, legal, tax, accounting, or insurance
        advice. Members should consult qualified professionals before making significant decisions.
      </p>
    </section>
  );
}
