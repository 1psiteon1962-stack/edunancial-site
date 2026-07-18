export const metadata = {
  title: "Rewards | Edunancial",
};

const rewards = [
  "Free eBooks",
  "Exclusive Courses",
  "Certificates",
  "Competency Badges",
  "Scholarships",
  "Marketplace Discounts",
  "Executive Content",
  "Community Recognition",
];

export default function RewardsPage() {

  return (

    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          REWARDS
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Earn While You Learn
        </h1>

        <div className="mt-20 grid gap-8 md:grid-cols-2">

          {rewards.map((reward) => (

            <div
              key={reward}
              className="rounded-xl bg-slate-900 p-8"
            >

              <h2 className="text-2xl font-black">
                {reward}
              </h2>

            </div>

          ))}

        </div>

      </section>

    </main>

  );

}
