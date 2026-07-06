export default function PlatformOverview() {

  const features = [

    "Learning Paths",

    "Case Studies",

    "Decision Labs",

    "Business Calculators",

    "AI Executive Team",

    "Competency Tracking",

    "Certifications",

    "Marketplace",

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          THE PLATFORM

        </p>

        <h2 className="mt-6 text-6xl font-black">

          Everything You Need To Build Financial Competency

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {features.map((feature)=>(

            <div
              key={feature}
              className="rounded-xl bg-slate-900 p-8"
            >

              {feature}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
