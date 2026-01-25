export default function PlansPage() {
  const plans = [
    {
      code: "free",
      name: "Free",
      description: "Basic access to public resources.",
      price: "$0",
    },
    {
      code: "starter",
      name: "Starter",
      description: "Entry-level tools and learning resources.",
      price: "$9/mo",
    },
    {
      code: "growth",
      name: "Growth",
      description: "Intermediate scaling and wealth-building content.",
      price: "$29/mo",
    },
    {
      code: "pro",
      name: "Pro",
      description: "Advanced tools, courses, and premium support.",
      price: "$99/mo",
    },
    {
      code: "enterprise",
      name: "Enterprise",
      description: "Full access for organizations and teams.",
      price: "Custom",
    },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800 }}>Plans</h1>

      <div style={{ marginTop: 24, display: "grid", gap: 16 }}>
        {plans.map((p) => (
          <div
            key={p.code}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>{p.name}</h2>

            <p style={{ marginTop: 8 }}>{p.description}</p>

            <div style={{ marginTop: 10, fontWeight: 700 }}>{p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
