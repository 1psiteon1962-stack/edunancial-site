export default function ThinkingFramework() {

  const framework = [

    "What is the problem?",

    "What assumptions am I making?",

    "What evidence supports those assumptions?",

    "What numbers matter?",

    "What are my options?",

    "What are the risks?",

    "What decision should I make?",

    "How will I measure success?",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          THINKING FRAMEWORK
        </p>

        <h2 className="mt-6 text-6xl font-black">

          Learn How To Think

        </h2>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">

          Edunancial teaches a repeatable decision-making process
          that students can use throughout their personal and
          professional lives.

        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-2">

          {framework.map((item) => (

            <div
              key={item}
              className="rounded-xl bg-slate-900 p-8"
            >

              {item}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
