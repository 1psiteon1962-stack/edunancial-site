export default function LearningResources() {

  const resources = [

    "Books",

    "Worksheets",

    "Templates",

    "Checklists",

    "Business Forms",

    "Financial Calculators",

    "AI Coaches",

    "Decision Labs",

  ];

  return (

    <section className="bg-[#08101f] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-5xl font-black">

          Learning Resources

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {resources.map((item)=>(

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
