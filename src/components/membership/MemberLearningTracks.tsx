export default function MemberLearningTracks() {
  const tracks = [
    {
      title: "Personal Finance",
      description: "Budgeting, saving, debt reduction and financial planning.",
    },
    {
      title: "Real Estate",
      description: "Rental property, commercial property, financing and analysis.",
    },
    {
      title: "Paper Assets",
      description: "Stocks, bonds, ETFs, mutual funds and portfolio management.",
    },
    {
      title: "Business",
      description: "Profit, KPIs, pricing, hiring, leadership and scaling.",
    },
    {
      title: "Artificial Intelligence",
      description: "Using AI to improve productivity and business operations.",
    },
    {
      title: "Global Business",
      description: "International expansion, payments and worldwide opportunities.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <div className="text-center">

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-400">
          Learning Tracks
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          Choose Your Learning Journey
        </h2>

      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

        {tracks.map((track) => (

          <div
            key={track.title}
            className="rounded-2xl border border-slate-700 bg-slate-900/60 p-8"
          >

            <h3 className="text-2xl font-bold">
              {track.title}
            </h3>

            <p className="mt-5 text-slate-300 leading-7">
              {track.description}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}
