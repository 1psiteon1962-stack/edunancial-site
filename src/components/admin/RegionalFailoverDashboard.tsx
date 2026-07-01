export default function RegionalFailoverDashboard() {
  return (
    <section className="rounded-xl bg-slate-900 p-8">

      <h2 className="text-3xl font-black text-white">
        Regional Failover
      </h2>

      <div className="mt-8 rounded-lg bg-slate-800 p-6">

        <p className="text-lg text-green-400">
          ✔ Automatic Regional Isolation Enabled
        </p>

        <ul className="mt-6 space-y-3 text-slate-300">

          <li>North America isolated</li>

          <li>Latin America isolated</li>

          <li>Caribbean isolated</li>

          <li>Europe isolated</li>

          <li>Africa isolated</li>

          <li>Asia-Pacific isolated</li>

        </ul>

      </div>

    </section>
  );
}
