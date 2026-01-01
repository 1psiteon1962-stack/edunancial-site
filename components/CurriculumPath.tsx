// components/CurriculumPath.tsx
import { curriculumMap } from "@/data/curriculumMap";

export default function CurriculumPath() {
  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Capitalist Progression</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {curriculumMap.map((m) => (
          <div key={m.level} className="border p-6 rounded-lg bg-white">
            <h3 className="text-xl font-semibold mb-2">
              Level {m.level}: {m.title}
            </h3>
            <p className="mb-4">{m.objective}</p>
            <ul className="list-disc ml-6">
              {m.competencies.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
