import { getAffiliateEarnings } from "@/lib/affiliates";

export default function AffiliatePage({
  params,
}: {
  params: { id: string };
}) {
  const earnings = getAffiliateEarnings(params.id);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Affiliate Dashboard</h1>
      <p><strong>ID:</strong> {params.id}</p>
      <p><strong>Total Earnings:</strong> ${earnings.toFixed(2)}</p>
    </main>
  );
}
