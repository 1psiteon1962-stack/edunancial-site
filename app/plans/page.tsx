const US_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 4.99,
    description: "Basic access for new investors.",
    features: ["Core lessons", "Community access"],
  },
  {
    id: "plus",
    name: "Plus",
    price: 7.99,
    description: "Expanded tools and deeper content.",
    features: ["Everything in Starter", "Extra modules"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 9.99,
    description: "Full access + premium resources.",
    features: ["Everything in Plus", "Premium downloads"],
  },
];

export default function PlansPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl font-bold">Plans</h1>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {US_PLANS.map((plan) => (
          <div
            key={plan.id}
            className="rounded-xl border p-6 shadow-sm"
          >
            <h2 className="text-2xl font-semibold">{plan.name}</h2>
            <p className="text-gray-600 mt-2">{plan.description}</p>

            <p className="mt-4 text-3xl font-bold">${plan.price}</p>

            <ul className="mt-4 list-disc pl-6">
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
