export default function MergersAcquisitionsAdvisor() {

  const stages = [

    "Target Search",

    "Due Diligence",

    "Business Valuation",

    "Negotiation",

    "Financing",

    "Integration",

    "Performance Review",

    "Exit Strategy",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          AI M&A ADVISOR
        </p>

        <h2 className="mt-6 text-5xl font-black">
          Growth Through Acquisition
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          {stages.map((stage)=>(

            <div key={stage} className="rounded-xl bg-slate-900 p-8">

              {stage}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
