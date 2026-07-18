import Link from "next/link";

export const metadata = {
  title: "Audiobook Library | Edunancial",
  description:
    "Listen to Edunancial books in English and Spanish while learning anywhere.",
};

const audiobooks = [
  "Wealth Building the RED, WHITE & BLUE Way",
  "Business Is About Making Profit",
  "Economic Self Defense",
  "Financial Competency",
  "RED 101",
  "WHITE 101",
  "BLUE 101",
];

export default function AudioBooksPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          AUDIOBOOK LIBRARY
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Learn Anywhere
        </h1>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">
          Listen while driving,
          exercising,
          commuting,
          or relaxing.
          Every audiobook will eventually be available in English and Spanish.
        </p>

        <div className="mt-20 space-y-6">

          {audiobooks.map((book) => (

            <div
              key={book}
              className="flex items-center justify-between rounded-xl bg-slate-900 p-8"
            >

              <div>

                <h2 className="text-3xl font-black">

                  {book}

                </h2>

                <p className="mt-3 text-slate-400">

                  English • Spanish • Audiobook

                </p>

              </div>

              <button className="rounded-lg bg-blue-600 px-8 py-3 font-bold">

                Listen

              </button>

            </div>

          ))}

        </div>

      </section>

      <section className="bg-[#111827]">

        <div className="mx-auto max-w-6xl px-6 py-20 text-center">

          <h2 className="text-5xl font-black">

            Learn Anytime.
            Learn Anywhere.

          </h2>

          <p className="mt-8 text-2xl text-slate-300">

            Your education should move with you.

          </p>

          <Link
            href="/books"
            className="mt-10 inline-block rounded-xl bg-green-600 px-10 py-5 text-xl font-bold"
          >

            Browse Book Library

          </Link>

        </div>

      </section>

    </main>
  );
}
