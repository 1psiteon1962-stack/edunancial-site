export default function RegionalPricingManager() {
  const regions = [
    ["United States", "$"],
    ["Canada", "CAD"],
    ["Uganda", "UGX"],
    ["Dominican Republic", "DOP"],
    ["Spain", "EUR"],
  ];

  return (
    <section className="rounded-xl bg-slate-900 p-8">
      <h2 className="text-3xl font-black text-white">
        Regional Pricing Manager
      </h2>

      <div className="mt-8 space-y-4">
        {regions.map(([country, currency]) => (
          <div
            key={country}
            className="flex justify-between rounded-lg bg-slate-800 p-4"
          >
            <span className="text-white">{country}</span>
            <span className="font-bold text-blue-400">{currency}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
