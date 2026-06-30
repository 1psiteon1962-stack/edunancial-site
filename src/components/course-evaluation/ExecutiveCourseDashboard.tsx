export default function ExecutiveCourseDashboard() {
  return (
    <main className="space-y-8">

      <h1 className="text-4xl font-black">
        Executive Course Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-xl bg-slate-900 p-6">
          Total Students
        </div>

        <div className="rounded-xl bg-slate-900 p-6">
          Completion Rate
        </div>

        <div className="rounded-xl bg-slate-900 p-6">
          Average Rating
        </div>

        <div className="rounded-xl bg-slate-900 p-6">
          Revenue
        </div>

      </div>

    </main>
  );
}
