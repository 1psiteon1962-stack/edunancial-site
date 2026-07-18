export const metadata = {
  title: "Learning Roadmaps | Edunancial",
};

const paths = [
  "Financial Foundations",
  "Teen Entrepreneur",
  "Business Owner",
  "Investor",
  "Real Estate",
  "Executive",
  "Family Learning",
  "Economic Self Defense",
];

export default function RoadmapsPage() {

  return (

    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          LEARNING ROADMAPS
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Follow A Structured Path
        </h1>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {paths.map((path) => (

            <div
              key={path}
              className="rounded-xl bg-slate-900 p-8"
            >

              <h2 className="text-2xl font-black">

                {path}

              </h2>

            </div>

          ))}

        </div>

      </section>

    </main>

  );

}
