// src/views/home/HomePage.tsx

import { loadPricing } from "../../lib/pricing/loadPricing";

export default async function HomePage() {
  const pricing = await loadPricing("us");

  return (
    <main>
      <h1>Edunancial</h1>

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
