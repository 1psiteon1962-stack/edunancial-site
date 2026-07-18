export const metadata = {
  title: "Achievement Badges | Edunancial",
};

const badges = [
  "First Course",
  "First Book",
  "First Assessment",
  "RED Explorer",
  "WHITE Investor",
  "BLUE Entrepreneur",
  "Family Leader",
  "Financial Competency",
];

export default function BadgesPage() {

  return (

    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          ACHIEVEMENT BADGES
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Celebrate Progress
        </h1>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {badges.map((badge) => (

            <div
              key={badge}
              className="rounded-xl bg-slate-900 p-8 text-center"
            >

              🏅

              <h2 className="mt-6 text-2xl font-black">

                {badge}

              </h2>

            </div>

          ))}

        </div>

      </section>

    </main>

  );

}
