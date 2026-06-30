export default function CourseEvaluationForm() {
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900 p-8">
      <h2 className="text-3xl font-bold mb-6">
        Course Evaluation
      </h2>

      <p className="text-slate-400 mb-8">
        Help us improve future courses.
      </p>

      <div className="space-y-6">

        <label className="block">
          Overall Course Rating (1-10)
          <input
            type="range"
            min="1"
            max="10"
            className="w-full"
          />
        </label>

        <label className="block">
          Content Quality
          <input
            type="range"
            min="1"
            max="10"
            className="w-full"
          />
        </label>

        <label className="block">
          Instructor Quality
          <input
            type="range"
            min="1"
            max="10"
            className="w-full"
          />
        </label>

        <button className="rounded-lg bg-blue-600 px-6 py-3 font-bold">
          Submit Evaluation
        </button>

      </div>
    </section>
  );
}
