export const metadata = {
  title: "Mission Center | Edunancial",
};

const missions = [
  "Create Your First Budget",
  "Track Expenses for 30 Days",
  "Increase Your Savings Rate",
  "Read One Financial Book",
  "Analyze One Public Company",
  "Create a Business Idea",
  "Calculate Your Net Worth",
  "Build a Financial Plan",
];

export default function MissionCenterPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          MISSION CENTER
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Complete Missions.
          <br />
          Build Competency.
        </h1>

        <div className="mt-20 grid gap-8 md:grid-cols-2">

          {missions.map((mission) => (

            <div
              key={mission}
              className="rounded-xl bg-slate-900 p-8 flex justify-between items-center"
            >

              <h2 className="text-2xl font-black">

                {mission}

              </h2>

              <button className="rounded-lg bg-green-600 px-5 py-3 font-bold">

                Start

              </button>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}
