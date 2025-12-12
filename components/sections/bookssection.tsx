"use client";

export default function BooksSection() {
  return (
    <section id="books" className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Books</h2>

        <p className="text-gray-600 max-w-3xl mx-auto mb-10">
          Practical, real-world financial books covering business, real estate,
          stocks, options, and long-term wealth strategies.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 shadow">
            <h3 className="font-semibold text-xl mb-2">Business Ownership</h3>
            <p className="text-gray-500">
              Learn how to structure, scale, and protect a real business.
            </p>
          </div>

          <div className="border rounded-lg p-6 shadow">
            <h3 className="font-semibold text-xl mb-2">Real Estate</h3>
            <p className="text-gray-500">
              From first property to portfolio-level investing.
            </p>
          </div>

          <div className="border rounded-lg p-6 shadow">
            <h3 className="font-semibold text-xl mb-2">Stocks & Options</h3>
            <p className="text-gray-500">
              Understand markets, risk, and disciplined investing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
