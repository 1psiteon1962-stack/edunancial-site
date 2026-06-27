export default function BooksPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">

      <section className="max-w-6xl mx-auto px-6 py-20">

        <h1 className="text-5xl md:text-6xl font-black">
          Edunancial Books
        </h1>

        <p className="text-gray-300 mt-4 text-xl">
          Downloadable eBooks focused on Economic Self Defense.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-16">

          <div className="bg-[#151b2d] rounded-2xl p-8">

            <h2 className="text-3xl font-bold text-red-500">
              Business Is About Profit
            </h2>

            <p className="mt-4 text-gray-300">
              Learn why profit—not revenue—is the foundation of every successful business.
            </p>

            <div className="mt-8 flex items-center justify-between">

              <span className="text-3xl font-bold">
                $9.99
              </span>

              <button className="bg-red-600 px-6 py-3 rounded-xl font-bold">
                Buy Now
              </button>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
