"use client";

type App = {
  id: string;
  name: string;
  description: string;
  access: string;
};

const apps: App[] = [
  {
    id: "crm",
    name: "CRM",
    description: "Customer relationship management system.",
    access: "Founder+",
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Business performance and data dashboards.",
    access: "Builder+",
  },
  {
    id: "finance",
    name: "Finance",
    description: "Revenue, expenses, and capital tracking.",
    access: "Pro+",
  },
];

export default function AppsPage() {
  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-black mb-8">Applications</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {apps.map((app) => (
          <div
            key={app.id}
            className="border rounded-xl p-6 bg-white shadow"
          >
            <h2 className="text-2xl font-bold">{app.name}</h2>
            <p className="mt-2">{app.description}</p>
            <p className="mt-4 text-sm text-gray-600">
              Access Level: <strong>{app.access}</strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
