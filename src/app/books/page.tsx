import Link from "next/link";

export default function BooksPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white px-6 py-20">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-6xl font-black">
          BOOK LIBRARY
        </h1>

        <p className="mt-6 text-xl text-gray-300">
          Practical financial education built around the
          Red. White. Blue. framework.
        </p>

        <div className="grid gap-8 mt-16 md:grid-cols-2 lg:grid-cols-3">

          <BookCard
            title="Business Is About Making Profit"
            category="BLUE"
            price="$19.99"
          />

          <BookCard
            title="Real Estate Foundations"
            category="RED"
            price="$14.99"
          />

          <BookCard
            title="Paper Assets"
            category="WHITE"
            price="$14.99"
          />

        </div>

      </div>

    </main>
  );
}

function BookCard({
  title,
  category,
  price,
}: {
  title: string;
  category: string;
  price: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101a2f] p-8">

      <div className="text-sm font-bold tracking-widest text-blue-400">
        {category}
      </div>

      <h2 className="mt-4 text-3xl font-black">
        {title}
      </h2>

      <p className="mt-8 text-2xl font-bold">
        {price}
      </p>

      <Link
        href="/checkout"
        className="mt-8 inline-block rounded-xl bg-blue-600 px-8 py-4 font-bold hover:bg-blue-500"
      >
        Buy Now
      </Link>

    </div>
  );
}
