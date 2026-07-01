export default function CountryHealthMonitor() {
  return (
    <section className="rounded-xl bg-slate-900 p-8">

      <h2 className="text-3xl font-black text-white">
        Country Health Monitor
      </h2>

      <div className="mt-8 grid gap-5 md:grid-cols-4">

        <Metric title="Active Users" value="18,420" />

        <Metric title="Courses" value="612" />

        <Metric title="Servers" value="100%" />

        <Metric title="Alerts" value="0" />

      </div>

    </section>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-slate-800 p-6">
      <div className="text-slate-400">{title}</div>
      <div className="mt-2 text-3xl font-black text-white">
        {value}
      </div>
    </div>
  );
}
