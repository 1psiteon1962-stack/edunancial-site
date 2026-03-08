"use client";

import { useState } from "react";

export default function ContractAcceptance({
  contractId,
  title
}: {
  contractId: string;
  title: string;
}) {
  const [accepted, setAccepted] = useState(false);

  async function handleAccept() {
    setAccepted(true);

    await fetch("/api/contracts/accept", {
      method: "POST",
      body: JSON.stringify({
        contractId
      })
    });
  }

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        borderRadius: 10,
        marginBottom: "1rem"
      }}
    >
      <h3>{title}</h3>

      {accepted ? (
        <p>Agreement accepted.</p>
      ) : (
        <button onClick={handleAccept}>Accept Agreement</button>
      )}
    </div>
  );
}
