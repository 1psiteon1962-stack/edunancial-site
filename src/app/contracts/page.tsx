// src/app/contracts/page.tsx

import { CONTRACT_TEMPLATES } from "@/lib/contracts/contractTypes";

export default function ContractsPage() {
  const contracts = Object.values(CONTRACT_TEMPLATES);

  return (
    <main>
      <h1>Contracts</h1>

      <p>
        Review the current Edunancial contract templates, policies, and
        agreements.
      </p>

      {contracts.map((contract) => (
        <section
          key={contract.key}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "16px",
          }}
        >
          <h2>{contract.title}</h2>
          <p>
            <strong>Version:</strong> {contract.version}
          </p>
          <p>
            <strong>Effective Date:</strong> {contract.effectiveDate}
          </p>
          <p>{contract.body}</p>
        </section>
      ))}
    </main>
  );
}
