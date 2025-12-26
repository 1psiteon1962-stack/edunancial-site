import { AFFILIATES } from "@/lib/affiliateRegistry";
import { getAffiliateEarnings } from "@/lib/affiliates";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return AFFILATES.map((affiliate) => ({
    id: affiliate.id,
  }));
}

export default function AffiliatePage({
  params,
}: {
  params: { id: string };
}) {
  const affiliate = AFFILATES.find((a) => a.id === params.id);

  if (!affiliate) {
    notFound();
  }

  const earnings = getAffiliateEarnings(params.id);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Affiliate Dashboard</h1>

      <p><strong>Name:</strong> {affiliate.name}</p>
      <p><strong>ID:</strong> {affiliate.id}</p>

      <p style={{ marginTop: "1rem" }}>
        <strong>Total Earnings:</strong> ${earnings.toFixed(2)}
      </p>
    </main>
  );
}
