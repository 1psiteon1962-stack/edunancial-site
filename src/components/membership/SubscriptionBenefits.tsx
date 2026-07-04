export default function SubscriptionBenefits() {

  const benefits = [

    "Automatic access to new courses",

    "Continuous competency tracking",

    "Monthly educational updates",

    "Priority feature releases",

    "New downloadable resources",

    "Marketplace enhancements",

    "AI recommendation improvements",

    "Future country expansion",

  ];

  return (

    <section className="mx-auto max-w-7xl px-6 py-20">

      <h2 className="text-center text-4xl font-bold">
        Your Membership Keeps Growing
      </h2>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {benefits.map((benefit) => (

          <div
            key={benefit}
            className="rounded-xl border border-slate-700 bg-slate-900/60 p-6"
          >

            ✓ {benefit}

          </div>

        ))}

      </div>

    </section>

  );

}
