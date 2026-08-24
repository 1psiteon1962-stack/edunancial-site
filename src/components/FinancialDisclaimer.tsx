import {
  EDUNANCIAL_CONTENT_DISCLAIMER,
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_METHODS_CLARIFICATION,
  EDUNANCIAL_NO_RELATIONSHIP_DISCLAIMER,
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
      <p>{EDUNANCIAL_CONTENT_DISCLAIMER}</p>
      <p>{EDUNANCIAL_NO_RELATIONSHIP_DISCLAIMER}</p>

      <p>
        Examples, calculations, simulations, projections, case studies, historical information, and
        hypothetical scenarios may simplify real-world conditions and are not promises, guarantees,
        recommendations, or predictions of actual results. Past or hypothetical performance does not
        guarantee future performance. Users are responsible for independent due diligence and should
        consult appropriately licensed or qualified professionals before making significant decisions.
      </p>
    </section>
  );
}
