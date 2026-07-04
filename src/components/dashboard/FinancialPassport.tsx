export default function FinancialPassport() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold">
        Financial Competency Passport
      </h2>

      <p className="mt-4 text-slate-600">
        Your passport records achievements,
        assessments, certifications and
        completed learning paths.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-4">

        <div className="rounded-xl bg-slate-100 p-5">

          <div className="text-sm text-slate-500">
            Assessments
          </div>

          <div className="mt-2 text-3xl font-bold">
            0
          </div>

        </div>

        <div className="rounded-xl bg-slate-100 p-5">

          <div className="text-sm text-slate-500">
            Certificates
          </div>

          <div className="mt-2 text-3xl font-bold">
            0
          </div>

        </div>

        <div className="rounded-xl bg-slate-100 p-5">

          <div className="text-sm text-slate-500">
            Courses
          </div>

          <div className="mt-2 text-3xl font-bold">
            0
          </div>

        </div>

        <div className="rounded-xl bg-slate-100 p-5">

          <div className="text-sm text-slate-500">
            Competency
          </div>

          <div className="mt-2 text-3xl font-bold">
            Pending
          </div>

        </div>

      </div>

    </section>
  );
}
