import Link from "next/link";

export default function HomeMembershipSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description:
        "Perfect for anyone beginning the journey toward financial competency.",
      benefits: [
        "Financial Competency Assessment",
        "Starter Learning Roadmap",
        "Selected Free Courses",
        "Free Downloads",
      ],
      href: "/membership?plan=free",
    },
    {
      name: "Silver",
      price: "$19.99/mo",
      description:
        "For members committed to improving their financial future.",
      benefits: [
        "Everything in Free",
        "Full Course Library",
        "Certificates",
        "Marketplace Access",
        "AI Coach",
      ],
      href: "/membership?plan=silver",
    },
    {
      name: "Gold",
      price: "$49.99/mo",
      description:
        "Maximum access for entrepreneurs, investors and business owners.",
      benefits: [
        "Everything in Silver",
        "Business KPI Dashboard",
        "Priority Support",
        "Premium Downloads",
        "Future Executive Tools",
      ],
      href: "/membership?plan=gold",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">

      <div className="text-center">

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Membership
        </p>

        <h2 className="mt-4 text-5xl font-bold">
          Become an Edunancial Member
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-xl text-slate-300">
          Financial literacy introduces knowledge.
          Membership develops lifelong financial competency through
          education, measurement, coaching and continuous improvement.
        </p>

      </div>

      <div className="mt-20 grid gap-8 lg:grid-cols-3">

        {plans.map((plan) => (

          <div
            key={plan.name}
            className="rounded-2xl border border-slate-700 bg-slate-900/60 p-8"
          >

            <h3 className="text-3xl font-bold">
              {plan.name}
            </h3>

            <p className="mt-4 text-5xl font-extrabold">
              {plan.price}
            </p>

            <p className="mt-6 text-slate-300">
              {plan.description}
            </p>

            <ul className="mt-8 space-y-3">
              {plan.benefits.map((item) => (
                <li key={item}>✓ {item}</li>
              ))}
            </ul>

            <Link
              href={plan.href}
              className="mt-10 inline-flex rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white"
            >
              Learn More
            </Link>

          </div>

        ))}

      </div>

    </section>
  );
}
