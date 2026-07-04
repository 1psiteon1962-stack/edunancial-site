export default function ExecutiveSummaryCard() {

  return (

    <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-8 shadow-sm">

      <h2 className="text-2xl font-bold">

        Executive Summary

      </h2>

      <div className="mt-8 space-y-5">

        <div className="rounded-xl bg-white p-5">

          <strong>Today's Priority</strong>

          <p className="mt-2 text-slate-600">

            Continue building recurring membership revenue.

          </p>

        </div>

        <div className="rounded-xl bg-white p-5">

          <strong>Top Recommendation</strong>

          <p className="mt-2 text-slate-600">

            Complete payment integrations and begin onboarding members.

          </p>

        </div>

        <div className="rounded-xl bg-white p-5">

          <strong>Expansion Focus</strong>

          <p className="mt-2 text-slate-600">

            United States, Canada, Uganda, Nigeria, Dominican Republic, and Spain.

          </p>

        </div>

      </div>

    </section>

  );

}
