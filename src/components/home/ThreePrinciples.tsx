export default function ThreePrinciples() {

  const principles = [

    {

      title: "Know Your Numbers",

      description: "Measure before making decisions.",

    },

    {

      title: "Solve Problems",

      description: "Businesses exist to solve problems profitably.",

    },

    {

      title: "Think Critically",

      description: "Evidence should guide every important decision.",

    },

  ];

  return (

    <section className="bg-[#08101f] py-24">

      <div className="mx-auto max-w-6xl px-6">

        <h2 className="text-center text-6xl font-black">

          Three Core Principles

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-3">

          {principles.map((item)=>(

            <div
              key={item.title}
              className="rounded-xl bg-slate-900 p-10"
            >

              <h3 className="text-3xl font-black">

                {item.title}

              </h3>

              <p className="mt-6 text-slate-300">

                {item.description}

              </p>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
