export default function MarketplaceCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold">
        Marketplace
      </h2>

      <p className="mt-4 text-slate-600">
        Connect with trusted professionals
        based upon your country, state,
        province or city.
      </p>

      <div className="mt-8 space-y-4">

        <div className="flex justify-between">
          <span>Attorneys</span>
          <strong>Coming Soon</strong>
        </div>

        <div className="flex justify-between">
          <span>Accountants</span>
          <strong>Coming Soon</strong>
        </div>

        <div className="flex justify-between">
          <span>Real Estate</span>
          <strong>Coming Soon</strong>
        </div>

        <div className="flex justify-between">
          <span>Financial Advisors</span>
          <strong>Coming Soon</strong>
        </div>

      </div>

      <button
        className="mt-10 w-full rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
      >
        Open Marketplace
      </button>

    </section>
  );
}
