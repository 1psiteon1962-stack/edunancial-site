export default function MembershipAdministrationPage() {

  const plans = [

    {
      name: "Basic",
      price: "$0.00",
      members: 0
    },

    {
      name: "Gold",
      price: "$0.00",
      members: 0
    },

    {
      name: "Platinum",
      price: "$0.00",
      members: 0
    }

  ];

  return (

    <main className="min-h-screen bg-[#08101f] text-white p-10">

      <h1 className="text-6xl font-black">

        Membership Administration

      </h1>

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
