import Link from "next/link";

export const metadata = {
  title: "Free Resources | Edunancial",
  description:
    "Download free financial education resources and begin building financial competency.",
};

const giveaways = [
  "10 Rules to Build Wealth",
  "Wealth Building the RED, WHITE & BLUE Way",
  "Financial Goal Planner",
  "Personal Budget Worksheet",
  "Net Worth Calculator",
  "Teen Entrepreneur Starter Guide",
  "Business Startup Checklist",
  "Investment Readiness Checklist",
];

export default function GiveawaysPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-6xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">
          FREE RESOURCES
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Learn For Free.
        </h1>

        <p className="mt-10 text-2xl leading-10 text-slate-300">
          Download practical financial resources while joining the
          Edunancial community.
        </p>

        <div className="mt-16 space-y-6">

          {giveaways.map((item) => (

            <div
              key={item}
              className="rounded-xl bg-slate-900 p-8 flex items-center justify-between"
            >

              <h2 className="text-2xl font-bold">
                {item}
              </h2>

              <button className="rounded-lg bg-green-600 px-6 py-3 font-bold">
                Download
              </button>

            </div>

          ))}

        </div>

      </section>

      <section className="bg-[#111827]">

        <div className="mx-auto max-w-4xl px-6 py-24 text-center">

          <h2 className="text-5xl font-black">
            Stay Connected
          </h2>

          <p className="mt-8 text-xl text-slate-300">
            Receive new books, courses, worksheets,
            videos, and announcements.
          </p>

          <div className="mt-12 space-y-5">

            <input
              type="text"
              placeholder="Full Name"
              className="w-full rounded-lg p-4 text-black"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full rounded-lg p-4 text-black"
            />

            <button className="w-full rounded-lg bg-blue-600 py-4 text-xl font-bold">
              Join Free
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}
