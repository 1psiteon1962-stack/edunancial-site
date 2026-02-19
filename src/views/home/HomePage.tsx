import { loadPricing } from "@/lib/pricing/loadPricing";

export default async function HomePage() {
  const pricing = await loadPricing();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Edunancial</h1>
      <p>Education, structure, and systems — built to scale globally.</p>

      <h2>Pricing ({pricing.currency})</h2>
      <ul>
        {pricing.products.map((p) => (
          <li key={p.sku}>
            {p.label}: {p.price}
          </li>
        ))}
      </ul>
    </main>
  );
}
