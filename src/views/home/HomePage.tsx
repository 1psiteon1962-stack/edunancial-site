import { loadPricing } from "@/lib/pricing/loadPricing";

export default async function HomePage() {
  const pricing = await loadPricing("us");

  return (
    <main>
      <section>
        <h1>Edunancial</h1>
        <p>
          Financial education, business structure, and long-term readiness for
          entrepreneurs, students, families, and global builders.
        </p>
      </section>

      <section>
        {pricing.map((plan) => (
          <div key={plan.id}>
            <h2>{plan.name}</h2>
            <p>
              {plan.currency} ${plan.price}
            </p>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
