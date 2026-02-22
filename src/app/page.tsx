import { loadPricing } from "@/lib/pricing/loadPricing";

export default async function HomePage() {
  const pricing = await loadPricing();

  return (
    <main style={{ padding: 40 }}>
      <h1>Edunancial</h1>

      <section>
        <h2>Pricing</h2>
        {pricing.map((plan) => (
          <div key={plan.id} style={{ marginBottom: 24 }}>
            <h3>{plan.name}</h3>
            <p>
              ${plan.price} {plan.currency}
            </p>
            <p>{plan.description}</p>
            <ul>
              {plan.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
