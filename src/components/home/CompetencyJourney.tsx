export default function CompetencyJourney() {
  const steps = [
    {
      title: "1. Assess",
      description:
        "Measure your current financial competency and establish your starting point.",
    },
    {
      title: "2. Learn",
      description:
        "Complete structured courses designed to build practical financial knowledge.",
    },
    {
      title: "3. Practice",
      description:
        "Apply concepts using real-world exercises, worksheets and simulations.",
    },
    {
      title: "4. Measure",
      description:
        "Track your competency score and monitor continuous improvement.",
    },
    {
      title: "5. Build Wealth",
      description:
        "Use better financial decisions to create long-term financial independence.",
    },
  ];

  return (
    <section className="py-24 bg-[#08101f]">
      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          YOUR JOURNEY
        </p>

        <h2 className="mt-6 text-6xl font-black">
          Financial Competency Roadmap
        </h2>

        <div className="mt-20 space-y-8">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-xl bg-slate-900 p-8"
            >
              <h3 className="text-3xl font-bold">
                {step.title}
              </h3>

              <p className="mt-4 text-xl text-slate-300">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
