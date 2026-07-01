export default function CurrencyExchangeDashboard() {
  return (
    <section className="rounded-xl bg-slate-900 p-8">

      <h2 className="text-3xl font-black text-white">
        Currency Exchange Dashboard
      </h2>

      <div className="mt-8 grid gap-4 md:grid-cols-4">

        <Metric name="USD" />

        <Metric name="EUR" />

        <Metric name="UGX" />

        <Metric name="DOP" />

      </div>

    </section>
  );
}

function Metric({ name }: { name: string }) {
  return (
    <div className="rounded-lg bg-slate-800 p-5">
      <div className="text-lg font-bold text-white">
        {name}
      </div>

      <div className="mt-2 text-slate-400">
        Live exchange rate
      </div>
    </div>
  );
}
