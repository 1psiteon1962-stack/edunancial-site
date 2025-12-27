// app/affiliate/[id]/page.tsx

import { notFound } from "next";

type PageProps = {
  params: {
    id: string;
  };
};

export default function AffiliatePage({ params }: PageProps) {
  const affiliateId = params.id; // ALWAYS a string in Next.js

  // Optional: if you truly need a number later
  // const numericId = Number(affiliateId);
  // if (Number.isNaN(numericId)) notFound();

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      <h1>Affiliate Portal</h1>

      <p>
        Affiliate ID: <strong>{affiliateId}</strong>
      </p>

      <section style={{ marginTop: "2rem" }}>
        <p>
          This page is used to track referrals, commissions, and attribution
          tied to this affiliate.
        </p>
      </section>
    </main>
  );
}
