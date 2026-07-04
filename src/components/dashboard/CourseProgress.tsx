export default function CourseProgress() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold">
        Course Progress
      </h2>

      <div className="mt-8 space-y-8">

        <div>

          <div className="mb-2 flex justify-between">

            <span>Overall Progress</span>

            <strong>0%</strong>

          </div>

          <div className="h-4 rounded-full bg-slate-200">

            <div
              className="h-4 rounded-full bg-blue-700"
              style={{ width: "0%" }}
            />

          </div>

        </div>

        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-xl bg-slate-100 p-5">

            <div className="text-sm text-slate-500">
              Courses Started
            </div>

            <div className="mt-2 text-3xl font-bold">
              0
            </div>

          </div>

          <div className="rounded-xl bg-slate-100 p-5">

            <div className="text-sm text-slate-500">
              Courses Completed
            </div>

            <div className="mt-2 text-3xl font-bold">
              0
            </div>

          </div>

          <div className="rounded-xl bg-slate-100 p-5">

            <div className="text-sm text-slate-500">
              Certificates Earned
            </div>

            <div className="mt-2 text-3xl font-bold">
              0
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
