export default function LifetimeLearning() {

  const stages = [

    "Student",

    "Young Adult",

    "Entrepreneur",

    "Business Owner",

    "Executive",

    "Investor",

    "Family Office",

    "Legacy",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-6xl font-black">

          Learning Never Stops

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {stages.map((stage)=>(

            <div
              key={stage}
              className="rounded-xl bg-slate-900 p-8 text-center"
            >

              {stage}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
