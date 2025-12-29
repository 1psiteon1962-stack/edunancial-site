// /components/LegalNotice.tsx

import { LEGAL_FRAMEWORK } from "@/lib/legalContent";

export default function LegalNotice() {
  return (
    <section
      style={{
        marginTop: "4rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid #e5e7eb",
        fontSize: "0.85rem",
        color: "#6b7280",
        lineHeight: "1.6",
        maxWidth: "900px",
      }}
    >
      <h4 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.75rem" }}>
        Legal Framework
      </h4>

      <p>{LEGAL_FRAMEWORK.platformNature}</p>
      <p>{LEGAL_FRAMEWORK.noAdvice}</p>
      <p>{LEGAL_FRAMEWORK.userResponsibility}</p>
      <p>{LEGAL_FRAMEWORK.jurisdiction}</p>
    </section>
  );
}
