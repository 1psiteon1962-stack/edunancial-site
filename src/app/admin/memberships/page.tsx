const plans = [
  {
    name: "Basic",
    price: "$0.00/mo",
    members: 0,
    features: ["Access to free content", "Community access", "Newsletter"],
    color: "border-gray-500",
  },
  {
    name: "Gold",
    price: "$0.00/mo",
    members: 0,
    features: ["Everything in Basic", "All books & courses", "Quizzes & certificates"],
    color: "border-yellow-500",
  },
  {
    name: "Platinum",
    price: "$0.00/mo",
    members: 0,
    features: ["Everything in Gold", "Live training", "1-on-1 coaching access", "Priority support"],
    color: "border-blue-500",
  },
];

export default function MembershipAdministrationPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8 lg:p-12">

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
          Commerce
        </p>
        <h1 className="mt-2 text-5xl font-black">
          Membership Administration
        </h1>
        <p className="mt-4 text-gray-400">
          Manage membership plans, access levels and subscriber counts.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-10">
        {[
          { label: "Total Members", value: "0" },
          { label: "Basic", value: "0" },
          { label: "Gold", value: "0" },
          { label: "Platinum", value: "0" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
            <p className="text-gray-400 text-sm">{label}</p>
            <h2 className="text-4xl font-black mt-2">{value}</h2>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-10">
        {plans.map((plan) => (
          <div key={plan.name} className={`rounded-2xl border-t-2 ${plan.color} bg-[#101a2f] border border-white/10 p-6`}>
            <h2 className="text-2xl font-black">{plan.name}</h2>
            <p className="mt-1 text-gray-400 text-sm">{plan.price}</p>
            <p className="mt-3 text-3xl font-black">{plan.members}</p>
            <p className="text-xs text-gray-400">active members</p>
            <ul className="mt-4 space-y-1.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-400">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex gap-2">
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold hover:bg-blue-700 transition-colors">
                Edit Plan
              </button>
              <button className="rounded-lg border border-white/10 px-4 py-2 text-xs font-bold hover:bg-white/5 transition-colors">
                View Members
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-6">
        <h2 className="font-bold mb-4">Membership Settings</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {[
            { label: "Trial Period", value: "7 days" },
            { label: "Billing Cycle", value: "Monthly" },
            { label: "Auto-Renewal", value: "Enabled" },
            { label: "Cancellation Policy", value: "End of period" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
              <span className="text-sm text-gray-400">{label}</span>
              <span className="text-sm font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
