export default function CompetencyLevels() {

  const levels = [

    "Beginner",

    "Developing",

    "Competent",

    "Advanced",

    "Expert",

    "Executive",

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-6xl px-6">

        <h2 className="text-5xl font-black">

          Competency Levels

        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3">

          {levels.map((level)=>(

            <div
              key={level}
              className="rounded-xl bg-slate-900 p-8 text-center"
            >

              <h3 className="text-3xl font-black">

                {level}

              </h3>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
