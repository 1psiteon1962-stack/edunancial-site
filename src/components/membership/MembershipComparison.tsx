export default function MembershipComparison() {

  const plans = [

    ["Free","✔","—","—"],

    ["Basic","✔","✔","—"],

    ["Professional","✔","✔","✔"],

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-6xl font-black">

          Compare Memberships

        </h2>

        <div className="mt-16 space-y-4">

          {plans.map((plan)=>(

            <div
              key={plan[0]}
              className="grid grid-cols-4 rounded-xl bg-slate-900 p-6"
            >

              <div className="font-bold">{plan[0]}</div>
              <div>Courses</div>
              <div>AI</div>
              <div>Certificates</div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
