export default function CrossBorderPaymentsAdvisor() {

  const systems = [

    "SWIFT",

    "SEPA",

    "ACH",

    "Wire Transfers",

    "Mobile Money",

    "Payment Gateways",

    "Stablecoins",

    "Blockchain Settlement",

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          AI CROSS-BORDER PAYMENTS

        </p>

        <h2 className="mt-6 text-5xl font-black">

          International Payments

        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          {systems.map((system)=>(

            <div key={system} className="rounded-xl bg-slate-900 p-8">

              {system}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
