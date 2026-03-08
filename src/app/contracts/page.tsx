import { CONTRACT_TEMPLATES } from "../../lib/contracts/contractTypes";

export default function ContractsPage() {
  return (
    <main style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <h1>Platform Agreements</h1>

      <p>
        Access to Edunancial education systems requires agreement to the
        following contractual protections and licensing rules.
      </p>

      {CONTRACT_TEMPLATES.map((contract) => (
        <section
          key={contract.id}
          style={{
            border: "1px solid #ddd",
            padding: "1rem",
            borderRadius: "10px",
            marginBottom: "1rem"
          }}
        >
          <h2>{contract.title}</h2>

          <p>{contract.description}</p>

          <p>
            <strong>Version:</strong> {contract.version}
          </p>

          <p>
            <strong>Languages:</strong> {contract.languages.join(", ")}
          </p>

          <p>
            <strong>Required for access:</strong>{" "}
            {contract.requiredForAccess ? "Yes" : "No"}
          </p>
        </section>
      ))}
    </main>
  );
}
