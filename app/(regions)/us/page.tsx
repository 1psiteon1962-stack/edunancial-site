import { US_CONTENT } from "@/data/regions/us.content";

export default function USHome() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold">Edunancial – United States</h1>
      <p className="text-lg mt-4">
        Built for the U.S. financial, legal, and business system.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {US_CONTENT.levels.map((level) => (
          <div key={level.id} className="border rounded-xl p-6 shadow">
            <h2 className="text-2xl font-semibold">{level.id} – {level.name}</h2>
            <p className="mt-2">{level.description}</p>
            <ul className="mt-4 list-disc pl-6">
              {level.modules.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
