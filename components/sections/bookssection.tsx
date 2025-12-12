export default function BooksSection() {
  return (
    <section className="w-full py-16 px-6 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Edunancial Books
        </h2>

        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          A complete library to help you master real estate, paper assets,
          business ownership, and more — in English and Spanish.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8">
          <div className="p-6 bg-gray-50 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3">
              Options Trading (White Series)
            </h3>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3">
              Tax Liens & Deeds (Red Series)
            </h3>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3">
              Business Is About Profit (Blue Series)
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
