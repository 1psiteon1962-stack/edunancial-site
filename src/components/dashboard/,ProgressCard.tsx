export default function ProgressCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold">
        Learning Progress
      </h2>

      <div className="mt-8">

        <div className="flex justify-between">
          <span>Overall Completion</span>
          <strong>0%</strong>
        </div>

        <div className="mt-3 h-4 rounded-full bg-slate-200">

          <div
            className="h-4 rounded-full bg-blue-700"
            style={{ width: "0%" }}
          />

        </div>

      </div>

      <div className="mt-10">

        <div className="flex justify-between">
          <span>Courses Completed</span>
          <strong>0</strong>
        </div>

        <div className="mt-4 flex justify-between">
          <span>Certificates</span>
          <strong>0</strong>
        </div>

        <div className="mt-4 flex justify-between">
          <span>Competency Score</span>
          <strong>Pending</strong>
        </div>

      </div>

    </section>
  );
}
