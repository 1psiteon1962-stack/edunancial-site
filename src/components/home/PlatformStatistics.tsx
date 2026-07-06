export default function PlatformStatistics() {

  const stats = [

    "9 Learning Paths",

    "100+ Courses",

    "50+ Case Studies",

    "25+ Business Tools",

    "20+ AI Advisors",

    "Decision Labs",

    "Competency Certifications",

    "Global Marketplace",

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          PLATFORM OVERVIEW

        </p>

        <h2 className="mt-6 text-6xl font-black">

          One Platform.
          Endless Growth.

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {stats.map((stat)=>(

            <div
              key={stat}
              className="rounded-xl bg-slate-900 p-8 text-center text-xl font-bold"
            >

              {stat}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
