"use client";

export default function CoursesSection() {
  return (
    <section id="courses" className="w-full py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Courses</h2>

        <p className="text-gray-600 max-w-3xl mx-auto mb-10">
          Structured, video-based courses designed to take you from beginner
          to confident decision-maker.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-xl mb-2">Startup Foundations</h3>
            <p className="text-gray-500">
              Business entities, compliance, and scaling fundamentals.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-xl mb-2">Financial Literacy</h3>
            <p className="text-gray-500">
              Budgeting, credit, investing, and long-term planning.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-xl mb-2">Advanced Investing</h3>
            <p className="text-gray-500">
              Options, leverage, and institutional-level thinking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
