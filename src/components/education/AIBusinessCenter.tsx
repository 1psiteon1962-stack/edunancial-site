export default function AIBusinessCenter() {
  const topics = [
    "Market Research",
    "Competitor Analysis",
    "Business Planning",
    "Financial Modeling",
    "Marketing Strategy",
    "Investment Proposals",
    "Risk Analysis",
    "Assumption Validation",
  ];

  return (
    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          AI FOR BUSINESS
        </p>

        <h2 className="mt-6 text-6xl font-black">
          AI Assists.
          <br />
          You Decide.
        </h2>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">
          AI accelerates research and analysis.
          Human judgment remains responsible for every business decision.
        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {topics.map((topic) => (
            <div
              key={topic}
              className="rounded-xl bg-slate-900 p-8"
            >
              {topic}
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}
