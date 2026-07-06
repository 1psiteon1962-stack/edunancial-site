export default function UgandaEggFarmROI() {

  const metrics = [

    "Feed Cost",

    "Egg Production",

    "Revenue",

    "Profit",

    "ROI",

    "Break-even",

  ];

  return (

    <section className="bg-[#08101f] py-24">

      <div className="mx-auto max-w-6xl px-6">

        <h2 className="text-5xl font-black">

          Uganda Egg Farm ROI

        </h2>

        <div className="mt-16 grid gap-6 md:grid-cols-3">

          {metrics.map((metric) => (

            <div
              key={metric}
              className="rounded-xl bg-slate-900 p-8"
            >

              {metric}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
