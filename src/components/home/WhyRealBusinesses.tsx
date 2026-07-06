export default function WhyRealBusinesses() {

  const items = [

    "Real Financial Numbers",

    "Real Entrepreneurs",

    "Real Successes",

    "Real Failures",

    "Real Decisions",

    "Real Consequences",

    "Real Improvements",

    "Real Results",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          REALITY-BASED LEARNING

        </p>

        <h2 className="mt-6 text-6xl font-black">

          Why Real Businesses Matter

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {items.map((item)=>(

            <div
              key={item}
              className="rounded-xl bg-slate-900 p-8"
            >

              {item}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
