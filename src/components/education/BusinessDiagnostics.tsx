export default function BusinessDiagnostics() {

  const questions = [

    "Is there real customer demand?",

    "Is the business profitable?",

    "Are cash reserves growing?",

    "Are KPIs improving?",

    "Is pricing appropriate?",

    "Are customers returning?",

    "Are expenses under control?",

    "Can the business scale?",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          BUSINESS DIAGNOSTICS
        </p>

        <h2 className="mt-6 text-6xl font-black">

          Diagnose Before You Decide

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-2">

          {questions.map((question) => (

            <div
              key={question}
              className="rounded-xl bg-slate-900 p-8"
            >

              □ {question}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
