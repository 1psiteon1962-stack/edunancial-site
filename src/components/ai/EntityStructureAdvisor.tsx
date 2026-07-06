export default function EntityStructureAdvisor() {

  const entities = [

    "Corporations",

    "LLCs",

    "Holding Companies",

    "Operating Companies",

    "Joint Ventures",

    "Trusts",

    "Foundations",

    "International Structures",

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          AI ENTITY STRUCTURE ADVISOR

        </p>

        <h2 className="mt-6 text-5xl font-black">

          Corporate Architecture

        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          {entities.map((entity)=>(

            <div key={entity} className="rounded-xl bg-slate-900 p-8">

              {entity}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
