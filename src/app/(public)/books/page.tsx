import Link from "next/link";

export const metadata = {
  title: "Book Library | Edunancial",
  description:
    "Financial literacy and financial competency books in English and Spanish.",
};

const books = [
  {
    title: "Wealth Building the RED, WHITE & BLUE Way",
    category: "Foundations",
    color: "border-red-600",
  },
  {
    title: "Business Is About Making Profit",
    category: "Business",
    color: "border-blue-600",
  },
  {
    title: "Economic Self Defense",
    category: "Personal Finance",
    color: "border-green-600",
  },
  {
    title: "Financial Competency",
    category: "Core Concepts",
    color: "border-yellow-500",
  },
];

export default function BooksPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">
          BOOK LIBRARY
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Learn At Your Own Pace
        </h1>

        <p className="mt-10 max-w-5xl text-2xl leading-10 text-slate-300">
          Every Edunancial book is available in English and Spanish,
          with audiobooks coming in future releases.
        </p>

        <div className="mt-20 grid gap-8 md:grid-cols-2">

          {books.map((book) => (

            <div
              key={book.title}
              className={`rounded-xl border-l-8 ${book.color} bg-slate-900 p-8`}
            >

              <p className="text-sm uppercase tracking-widest text-yellow-400">
                {book.category}
              </p>

              <h2 className="mt-4 text-3xl font-black">
                {book.title}
              </h2>

              <div className="mt-10 flex gap-4">

                <button className="rounded-lg bg-blue-600 px-6 py-3 font-bold">
                  Preview
                </button>

                <button className="rounded-lg border border-white px-6 py-3 font-bold">
                  Learn More
                </button>

              </div>

            </div>

          ))}

        </div>

        <div className="mt-20 flex flex-wrap justify-center gap-6">

          <Link
            href="/library?type=book"
            className="rounded-xl bg-blue-600 px-10 py-5 text-xl font-bold"
          >
            Browse Full Book Library
          </Link>

          <Link
            href="/giveaways"
            className="rounded-xl bg-green-600 px-10 py-5 text-xl font-bold"
          >
            Free Resources
          </Link>

        </div>

      </section>

    </main>
  );
}
