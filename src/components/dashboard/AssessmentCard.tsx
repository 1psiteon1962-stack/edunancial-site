export default function AssessmentCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold">
        Financial Competency Assessment
      </h2>

      <div className="mt-8 space-y-5">

        <div className="flex justify-between">
          <span>Last Assessment</span>
          <strong>Not Completed</strong>
        </div>

        <div className="flex justify-between">
          <span>Competency Score</span>
          <strong>Pending</strong>
        </div>

        <div className="flex justify-between">
          <span>Recommended</span>
          <strong>Take Assessment</strong>
        </div>

      </div>

      <button
        className="mt-10 w-full rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
      >
        Start Assessment
      </button>

    </section>
  );
}
