export default function MembershipAdministrationPage() {

  const plans = [

    {
      name: "Individual Membership",
      price: "$24.99 / month",
      members: 0
    },

    {
      name: "Approved Organization Membership",
      price: "$14.99 / member / month",
      members: 0
    },

    {
      name: "100+ Member Organization Rate",
      price: "$9.99 / active paid member / month",
      members: 0
    }

  ];

  return (

    <main className="min-h-screen bg-[#08101f] text-white p-10">

      <h1 className="text-6xl font-black">

        Membership Administration

      </h1>

      <p className="mt-6 max-w-4xl text-lg text-slate-300">
        Beta Tester access is managed separately through the invitation-only beta workflow and is
        intentionally hidden from public pricing.
      </p>

      <div className="grid gap-8 mt-12 lg:grid-cols-3">

        {plans.map(plan=>(

          <div
            key={plan.name}
            className="rounded-2xl bg-[#101a2f] border border-white/10 p-8"
          >

            <h2 className="text-3xl font-black">

              {plan.name}

            </h2>

            <p className="mt-5">

              Monthly Price: {plan.price}

            </p>

            <p>

              Active Members: {plan.members}

            </p>

          </div>

        ))}

      </div>

    </main>

  );

}
