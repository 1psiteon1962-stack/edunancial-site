import Link from "next/link";

export const metadata = {
  title: "Flash Cards | Edunancial",
};

const decks = [
  "Budgeting",
  "Credit",
  "Investing",
  "Real Estate",
  "Business",
  "Accounting",
  "Taxes",
  "Financial Terms",
];

export default function FlashCardsPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">
          FLASH CARDS
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Learn Faster
        </h1>

        <p className="mt-10 text-2xl leading-10 text-slate-300">
          Review concepts anywhere using interactive flash cards.
        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {decks.map((deck) => (

            <Link
              key={deck}
              href="#"
              className="rounded-xl bg-slate-900 p-10 text-center hover:bg-slate-800"
            >

              <h2 className="text-2xl font-black">

                {deck}

              </h2>

            </Link>

          ))}

        </div>

      </section>

    </main>
  );
}
