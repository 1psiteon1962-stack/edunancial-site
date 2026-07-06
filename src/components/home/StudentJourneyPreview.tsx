export default function StudentJourneyPreview() {

  const journey = [

    "Assess",

    "Learn",

    "Practice",

    "Apply",

    "Measure",

    "Improve",

    "Certify",

    "Build Wealth",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-6xl font-black">

          Your Journey

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {journey.map((step)=>(

            <div
              key={step}
              className="rounded-xl bg-slate-900 p-8 text-center"
            >

              {step}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
