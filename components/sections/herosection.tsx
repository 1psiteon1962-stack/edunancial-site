"use client";

export default function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-br from-cyan-600 via-blue-700 to-blue-900 text-white py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
          Financial Power Starts With Education
        </h1>

        <p className="mt-6 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
          Edunancial empowers families and entrepreneurs across the Caribbean,
          Latin America, Africa, and the United States with bilingual financial
          education built for real-world growth.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <a
            href="#books"
            className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-yellow-300 transition"
          >
            Explore Books
          </a>

          <a
            href="#courses"
            className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-gray-200 transition"
          >
            View Courses
          </a>
        </div>
      </div>
    </section>
  );
}
