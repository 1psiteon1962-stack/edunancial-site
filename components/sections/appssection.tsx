export default function AppsSection() {
  return (
    <section className="w-full py-16 px-6 md:px-12 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Edunancial Apps</h2>

        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Interactive tools designed to help you learn faster, calculate
          smarter, and make informed financial decisions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">EduMath</h3>
            <p className="text-gray-700 mb-4">
              The math engine behind Edunancial. Learn the numbers behind
              business, investing, and financial analysis.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">EduVesting</h3>
            <p className="text-gray-700 mb-4">
              An AI-powered investment evaluation tool. Not financial advice —
              just a smarter way to evaluate your ideas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
