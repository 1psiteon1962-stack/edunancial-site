import { loadPricing } from "@/lib/pricing/loadPricing";

export default async function HomePage() {
  const pricing = await loadPricing("us"); // resolve the Promise here

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Edunancial</h1>

      <h2>Pricing ({pricing.currency})</h2>

      <ul>
        {pricing.products.map((p) => (
          <li key={p.sku}>
            <strong>{p.label}</strong> — {p.price} {pricing.currency}
            {p.description && <p>{p.description}</p>}
            {p.features && (
              <ul>
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
