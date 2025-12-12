export default function CoursesSection() {
  return (
    <section className="w-full py-16 px-6 md:px-12 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Edunancial Courses
        </h2>

        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Learn at your own pace with video-based training, step-by-step
          tutorials, downloadable worksheets, and structured modules.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">
              Real Estate Foundations
            </h3>
            <p className="text-gray-700">
              From property basics to financing, valuations, and acquisitions.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Entrepreneurship 101</h3>
            <p className="text-gray-700">
              Business planning, structuring, scaling, and investor readiness.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
