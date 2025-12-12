"use client";

export default function AppsSection() {
  return (
    <section id="apps" className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Apps</h2>

        <p className="text-gray-600 max-w-3xl mx-auto mb-10">
          Interactive tools designed to support smarter decisions and real-time
          analysis.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 shadow">
            <h3 className="font-semibold text-xl mb-2">EduVesting</h3>
            <p className="text-gray-500">
              AI-powered investment analysis and decision support.
            </p>
          </div>

          <div className="border rounded-lg p-6 shadow">
            <h3 className="font-semibold text-xl mb-2">EduMath</h3>
            <p className="text-gray-500">
              Learn financial math visually and intuitively.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
