import Link from "next/link";

export default function GlobalExpansion() {
  const regions = [
    "North America",
    "Latin America",
    "Europe",
    "Africa",
    "Asia",
    "Oceania",
  ];

  return (
    <section className="bg-[#08101f] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          GLOBAL EDUCATION
        </p>

        <h2 className="mt-6 text-6xl font-black">
          One Mission.
          <br />
          Worldwide Impact.
        </h2>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">
          Edunancial is being designed as a global financial competency
          platform with country-specific content, regional marketplaces,
          localized payment systems, and multilingual education.
        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-3">

          {regions.map((region) => (

            <div
              key={region}
              className="rounded-xl bg-slate-900 p-8"
            >

              <h3 className="text-2xl font-black">
                {region}
              </h3>

            </div>

          ))}

        </div>

        <div className="mt-16">

          <Link
            href="/global"
            className="rounded-xl bg-blue-600 px-10 py-5 font-bold hover:bg-blue-700"
          >
            Explore Global Expansion
          </Link>

        </div>

      </div>

    </section>
  );
}
