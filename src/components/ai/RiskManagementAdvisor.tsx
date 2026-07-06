export default function RiskManagementAdvisor() {

  const risks = [

    "Financial Risk",

    "Operational Risk",

    "Legal Risk",

    "Currency Risk",

    "Market Risk",

    "Cybersecurity",

    "Supply Chain",

    "Reputation",

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          AI RISK MANAGEMENT
        </p>

        <h2 className="mt-6 text-5xl font-black">
          Identify Risk Before It Becomes a Problem
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          {risks.map((risk)=>(

            <div key={risk} className="rounded-xl bg-slate-900 p-8">

              {risk}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
