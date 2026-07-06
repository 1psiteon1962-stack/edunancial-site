export default function AIInnovationLab() {

  const ideas = [

    "Product Innovation",

    "Process Innovation",

    "Automation",

    "Artificial Intelligence",

    "Blockchain",

    "New Revenue Streams",

    "Strategic Partnerships",

    "Future Technologies",

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          AI INNOVATION LAB

        </p>

        <h2 className="mt-6 text-5xl font-black">

          Discover What's Next

        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-4">

          {ideas.map((idea)=>(

            <div key={idea} className="rounded-xl bg-slate-900 p-8">

              {idea}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
