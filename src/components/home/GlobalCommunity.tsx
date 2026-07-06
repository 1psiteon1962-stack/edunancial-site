export default function GlobalCommunity() {

  const regions = [

    "North America",

    "Latin America",

    "Caribbean",

    "Africa",

    "Europe",

    "Asia",

    "Middle East",

    "Oceania",

  ];

  return (

    <section className="bg-[#08101f] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          GLOBAL COMMUNITY

        </p>

        <h2 className="mt-6 text-6xl font-black">

          Learn Anywhere In The World

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {regions.map((region)=>(

            <div
              key={region}
              className="rounded-xl bg-slate-900 p-8"
            >

              {region}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
