const agents = [
  "Financial Coach AI",
  "Business Advisor AI",
  "Investment AI",
  "Real Estate AI",
  "Pricing AI",
  "Grant Research AI",
  "Country Intelligence AI",
  "Curriculum AI",
  "Learning Coach AI",
  "Executive AI",
];

export default function AICommandCenter() {
  return (
    <section className="rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 p-10">

      <p className="font-bold uppercase tracking-[0.4em] text-yellow-400">
        AI COMMAND CENTER
      </p>

      <h2 className="mt-4 text-5xl font-black">
        Your Team of AI Advisors
      </h2>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        {agents.map((agent) => (
          <div
            key={agent}
            className="rounded-xl bg-slate-800 p-5"
          >
            {agent}
          </div>
        ))}

      </div>

    </section>
  );
}
