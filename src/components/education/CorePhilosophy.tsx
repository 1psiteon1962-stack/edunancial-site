export default function CorePhilosophy() {

  const principles = [

    "Start with the problem, not the product.",

    "Know your numbers.",

    "Profit is the purpose of business.",

    "Hope requires evidence.",

    "Reality is more important than assumptions.",

    "Financial literacy teaches knowledge.",

    "Financial competency teaches judgment.",

    "AI assists people. AI does not replace human judgment.",

    "Real businesses teach better than hypothetical examples.",

  ];

  return (

    <section className="bg-[#08101f] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          OUR PHILOSOPHY
        </p>

        <h2 className="mt-6 text-6xl font-black">

          The Principles Behind Edunancial

        </h2>

        <div className="mt-20 space-y-6">

          {principles.map((principle) => (

            <div
              key={principle}
              className="rounded-xl bg-slate-900 p-8 text-xl"
            >

              • {principle}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
