"use client";

export default function HeroSection() {
  return (
    <section className="w-full bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Build Wealth With Knowledge
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Edunancial helps you master real estate, business, stocks, and
          personal finance—through simple, accessible, bilingual education.
        </p>

        <a
          href="#books"
          className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Start Learning
        </a>
      </div>
    </section>
  );
}
