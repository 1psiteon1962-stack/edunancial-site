export default function CountryDeploymentQueue() {
  const queue = [
    "Kenya",
    "Nigeria",
    "Canada",
    "Dominican Republic",
    "Brazil",
    "Spain",
  ];

  return (
    <section className="rounded-xl bg-slate-900 p-8">
      <h2 className="text-3xl font-black text-white">
        Deployment Queue
      </h2>

      <div className="mt-8 space-y-3">
        {queue.map((country, i) => (
          <div
            key={country}
            className="flex justify-between rounded bg-slate-800 p-4"
          >
            <span className="text-white">{country}</span>
            <span className="text-blue-400">
              Position {i + 1}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
