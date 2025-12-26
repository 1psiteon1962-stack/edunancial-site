export default function LegalFooter() {
  return (
    <footer
      style={{
        marginTop: "4rem",
        padding: "2rem",
        fontSize: "0.85rem",
        borderTop: "1px solid #ccc",
      }}
    >
      <p>
        © {new Date().getFullYear()} Caban International Holdings, Inc.
      </p>
      <p>
        Edunancial is a licensed brand and platform. All intellectual property,
        systems, methodologies, and content are owned by Caban International
        Holdings, Inc. and used under license.
      </p>
      <p>
        This platform provides general informational content only. It does not
        provide legal, tax, investment, or financial advice.
      </p>
    </footer>
  );
}
