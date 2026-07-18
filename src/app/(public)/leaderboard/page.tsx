export const metadata = {
  title: "Leaderboard | Edunancial",
};

const leaders = [
  ["Maria", 1820],
  ["David", 1765],
  ["Sophia", 1710],
  ["James", 1698],
  ["Olivia", 1655],
  ["Daniel", 1610],
  ["Emma", 1598],
  ["Michael", 1550],
];

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-5xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          LEADERBOARD
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Top Competency Scores
        </h1>

        <div className="mt-20 space-y-5">

          {leaders.map(([name, score], index) => (

            <div
              key={name}
              className="flex justify-between rounded-xl bg-slate-900 p-6"
            >

              <span className="font-bold">
                #{index + 1} {name}
              </span>

              <span className="text-yellow-400 font-bold">
                {score} XP
              </span>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}
