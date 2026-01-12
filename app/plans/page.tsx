import { US_PLANS } from "@/data/plans/us.plans";

export default function PlansPage() {
  return (
    <div className="max-w-5xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Edunancial Plans – United States</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {US_PLANS.map(plan => (
          <div key={plan.code} className="border p-6 rounded-xl shadow">
            <h2 className="text-2xl font-semibold">{plan.name}</h2>
            <p className="text-gray-600 mt-2">{plan.description}</p>

            <p className="text-3xl mt-4">
              {plan.price === 0 ? "Free" : `$${plan.price}/mo`}
            </p>

            <ul className="mt-4 space-y-1 text-sm">
              {plan.features.map(f => (
                <li key={f}>• {f}</li>
              ))}
            </ul>

            <button className="mt-6 w-full bg-black text-white py-2 rounded">
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
