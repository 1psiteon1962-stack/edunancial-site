export default function RevenueCard() {

  return (

    <section className="rounded-2xl border border-green-200 bg-green-50 p-8 shadow-sm">

      <h2 className="text-2xl font-bold">

        Revenue Dashboard

      </h2>

      <div className="mt-8 grid gap-4 md:grid-cols-2">

        <Metric
          label="Today"
          value="$0.00"
        />

        <Metric
          label="This Month"
          value="$0.00"
        />

        <Metric
          label="Annual"
          value="$0.00"
        />

        <Metric
          label="Recurring Members"
          value="0"
        />

      </div>

    </section>

  );

}

function Metric({

  label,

  value,

}: {

  label: string;

  value: string;

}) {

  return (

    <div className="rounded-xl bg-white p-5">

      <div className="text-sm text-slate-500">

        {label}

      </div>

      <div className="mt-2 text-3xl font-bold">

        {value}

      </div>

    </div>

  );

}
