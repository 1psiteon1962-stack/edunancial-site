import { US_APPS } from "@/data/apps/us.apps";

export default function AppsPage() {
  return (
    <main className="max-w-6xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold">Edunancial Founder Apps</h1>
      <p className="mt-4 text-lg">
        Tools used by U.S. founders to track growth, risk, and investor readiness.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mt-10">
        {US_APPS.map(app => (
          <div key={app.id} className="border rounded-xl p-6 shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold">{app.name}</h2>
            <p className="mt-2">{app.description}</p>
            <p className="mt-4 text-sm text-gray-600">
              Access Level: <strong>{app.access.toUpperCase()}</strong>
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
