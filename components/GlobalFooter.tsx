export default function GlobalFooter() {
  return (
    <footer
      style={{
        marginTop: "4rem",
        paddingTop: "2rem",
        borderTop: "1px solid #e5e5e5",
        fontSize: "0.9rem",
        color: "#555",
      }}
    >
      <p>
        © {new Date().getFullYear()} Caban International Holdings, Inc.
      </p>
      <p>
        All intellectual property, frameworks, systems, and content are owned by
        Caban International Holdings, Inc. and licensed for use by Edunancial.
      </p>
      <p>
        Edunancial provides informational and strategic frameworks only. Nothing
        on this site constitutes legal, financial, tax, or investment advice.
      </p>
    </footer>
  );
}
