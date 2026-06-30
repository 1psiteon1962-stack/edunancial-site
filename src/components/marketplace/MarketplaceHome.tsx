import Link from "next/link";

const categories = [
  "CPAs",
  "Bookkeepers",
  "Attorneys",
  "Commercial Realtors",
  "Mortgage Brokers",
  "Insurance",
  "Financial Coaches",
  "Business Consultants",
  "Investment Professionals",
  "1031 Exchange Specialists"
];

export default function MarketplaceHome() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="max-w-7xl mx-auto px-6 py-16">

        <h1 className="text-5xl font-black">
          Edunancial Marketplace
        </h1>

        <p className="mt-4 text-gray-400 text-xl">
          Find trusted professionals to help build and protect your wealth.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">

          {categories.map((category) => (

            <Link
              key={category}
              href="/marketplace/search"
              className="rounded-xl bg-slate-900 border border-slate-700 p-8 hover:border-blue-500 transition"
            >
              <h2 className="text-2xl font-bold">
                {category}
              </h2>

              <p className="text-gray-400 mt-3">
                Browse Professionals
              </p>

            </Link>

          ))}

        </div>

      </section>

    </main>
  );
}
