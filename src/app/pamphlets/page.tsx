import Link from "next/link";

export const metadata = {
  title: "Pamphlet Library | Edunancial",
  description:
    "Short, practical financial guides designed to build financial competency.",
};

const pamphlets = [
  "Wealth Building the RED, WHITE & BLUE Way",
  "RED 101",
  "WHITE 101",
  "BLUE 101",
  "10 Rules to Build Wealth",
  "Economic Self Defense",
  "Financial Competency",
  "Starting Your First Business",
];

export default function PamphletsPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">
          PAMPHLET LIBRARY
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Learn In Minutes
        </h1>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">
          Short practical guides that introduce important concepts
          before moving into full courses and books.
        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-2">

          {pamphlets.map((item) => (

            <div
              key={item}
              className="rounded-xl bg-slate-900 p-8"
            >

              <h2 className="text-3xl font-black">
                {item}
              </h2>

              <div className="mt-10 flex gap-4">

                <button className="rounded-lg bg-blue-600 px-6 py-3 font-bold">
                  Read
                </button>

                <button className="rounded-lg border border-white px-6 py-3 font-bold">
                  Download
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}
