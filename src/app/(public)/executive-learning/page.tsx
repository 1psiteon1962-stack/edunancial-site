export const metadata = {
  title: "Executive Learning | Edunancial",
};

const executiveTopics = [
  "KPIs",
  "Leadership",
  "Scaling",
  "Cash Flow",
  "Profit",
  "Risk Management",
  "Strategic Planning",
  "Artificial Intelligence",
];

export default function ExecutiveLearningPage() {

  return (

    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">
          EXECUTIVE LEARNING
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Leadership Through Competency
        </h1>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {executiveTopics.map((topic) => (

            <div
              key={topic}
              className="rounded-xl bg-slate-900 p-8 text-center"
            >

              <h2 className="text-2xl font-black">

                {topic}

              </h2>

            </div>

          ))}

        </div>

      </section>

    </main>

  );

}
