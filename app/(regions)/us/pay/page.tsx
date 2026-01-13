import { PLANS } from "@/app/types/plan";

export default function PayPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Upgrade Your Access</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {PLANS.map(plan => (
          <div key={plan.id} className="border p-4 rounded">
            <h2 className="font-bold">{plan.name}</h2>
            <p>{plan.description}</p>
            <p className="font-bold mt-2">${plan.price}</p>
            <button className="mt-4 bg-black text-white px-4 py-2 rounded">
              Upgrade
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
