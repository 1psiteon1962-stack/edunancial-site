// src/app/page.tsx

import { loadPricing } from "@/lib/pricing/loadPricing";

export default async function HomePage() {
  const pricing = await loadPricing();

  return (
    <main style={{ padding: "2rem" }}>
      <h2>Pricing ({pricing.currency})</h2>

      <ul>
        {pricing.products.map((product) => (
          <li key={product.sku} style={{ marginBottom: "1.5rem" }}>
            <strong>
              {product.label} – ${product.price}
            </strong>

            {product.description && (
              <p style={{ margin: "0.5rem 0" }}>
                {product.description}
              </p>
            )}

            {product.features && (
              <ul>
                {product.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
