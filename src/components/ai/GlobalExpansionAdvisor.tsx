export default function GlobalExpansionAdvisor() {

  const items = [

    "Country Selection",

    "Market Research",

    "Banking",

    "Licensing",

    "Hiring",

    "Tax Planning",

    "Localization",

    "Scaling",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          AI GLOBAL EXPANSION
        </p>

        <h2 className="mt-6 text-5xl font-black">
          Expand Internationally
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          {items.map((item)=>(

            <div key={item} className="rounded-xl bg-slate-900 p-8">

              {item}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
