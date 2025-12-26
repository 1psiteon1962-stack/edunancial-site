import { AFFILIATES } from "@/lib/affiliates";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return AFFILIATES.map((affiliate) => ({
    id: affiliate.id,
  }));
}

export default function AffiliatePage({
  params,
}: {
  params: { id: string };
}) {
  const affiliate = AFFILIATES.find((a) => a.id === params.id);

  if (!affiliate) {
    notFound();
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Affiliate Dashboard</h1>
      <p><strong>ID:</strong> {affiliate.id}</p>
      <p><strong>Name:</strong> {affiliate.name}</p>
    </main>
  );
}
