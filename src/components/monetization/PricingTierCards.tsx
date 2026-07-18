export default function PricingTierCards() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: "Starter access for basic learning and limited tools.",
      features: [
        "Starter pamphlets",
        "Limited lessons",
        "Basic assessment",
        "5 AI questions per month",
      ],
    },
    {
      name: "Gold",
      price: "$59.99/month",
      description: "Courses, missions, assessments, and progress tracking.",
      features: [
        "Unlimited courses",
        "Mission Center",
        "Family Challenges",
        "Certificates",
        "Monthly AI Coach",
      ],
    },
    {
      name: "Executive",
      price: "$99/month",
      description: "Advanced business education and simulations.",
      features: [
        "Business Simulations",
        "Executive Dashboard",
        "AI Strategy Reports",
        "Investor Readiness",
        "Priority Support",
      ],
    },
  ];

  return (
    <section className="rounded-xl bg-slate-900 p-8">
      <h2 className="text-4xl font-black text-white">
        Membership Plans
      </h2>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="rounded-xl border border-slate-700 bg-slate-800 p-6"
          >
            <h3 className="text-2xl font-black text-white">
              {tier.name}
            </h3>

            <p className="mt-3 text-4xl font-black text-blue-400">
              {tier.price}
            </p>

            <p className="mt-4 text-slate-300">
              {tier.description}
            </p>

            <ul className="mt-6 space-y-2">
              {tier.features.map((feature) => (
                <li
                  key={feature}
                  className="text-slate-300"
                >
                  ✓ {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
