export default function BusinessDisciplines() {

  const disciplines = [

    "Leadership",

    "Finance",

    "Marketing",

    "Sales",

    "Operations",

    "Technology",

    "Human Resources",

    "Strategy",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          BUSINESS DISCIPLINES

        </p>

        <h2 className="mt-6 text-6xl font-black">

          Learn Every Area Of Business

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {disciplines.map((discipline)=>(

            <div
              key={discipline}
              className="rounded-xl bg-slate-900 p-8"
            >

              {discipline}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
