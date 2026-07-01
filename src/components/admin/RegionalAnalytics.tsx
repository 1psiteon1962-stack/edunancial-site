export default function RegionalAnalytics() {
  return (
    <section className="rounded-xl bg-slate-900 p-8">

      <h2 className="text-3xl font-black text-white">

        Regional Analytics

      </h2>

      <div className="mt-8 grid gap-5 md:grid-cols-3">

        <Card title="Revenue">
          Regional revenue by continent.
        </Card>

        <Card title="Growth">
          User growth and retention.
        </Card>

        <Card title="Localization">
          Translation completion and adoption.
        </Card>

      </div>

    </section>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-slate-800 p-6">
      <h3 className="font-bold text-white">{title}</h3>
      <p className="mt-3 text-slate-400">{children}</p>
    </div>
  );
}
