import { loadPricing } from "@/lib/pricing/loadPricing";

export default async function HomePage() {
  const region =
    process.env.SITE_REGION?.toLowerCase() || "us";

  const pricing = await loadPricing(region);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Edunancial</h1>

      <h2>Pricing ({pricing.currency})</h2>
      <ul>
        {pricing.tiers.map((tier) => (
          <li key={tier.name}>
            <strong>{tier.name}</strong> – {tier.price} {pricing.currency}
            <ul>
              {tier.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
