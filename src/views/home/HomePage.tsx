import { loadPricing } from "@/lib/pricing/loadPricing";

export default async function HomePage() {
  const region = (process.env.SITE_REGION || "us").toLowerCase();
  const pricing = loadPricing(region);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Edunancial</h1>

      <h2>Pricing ({pricing.currency})</h2>

      <ul>
        {pricing.products.map((p) => (
          <li key={p.sku} style={{ marginBottom: "1rem" }}>
            <div>
              <strong>{p.label}</strong> — {p.price} {pricing.currency}
            </div>
            {p.description ? <div>{p.description}</div> : null}
            {p.features?.length ? (
              <ul>
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
