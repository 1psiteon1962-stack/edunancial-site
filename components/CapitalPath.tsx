import { curriculumMap } from "@/data/curriculumMap";

export default function CurriculumPath() {
  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">
        The Edunancial Learning Path
      </h2>

      <div className="grid gap-8 md:grid-cols-2">
        {curriculumMap.map(module => (
          <div
            key={module.level}
            className="border rounded-lg p-6 shadow-sm bg-white"
          >
            <h3 className="text-xl font-semibold mb-2">
              Level {module.level}: {module.title}
            </h3>
            <p className="mb-4">{module.objective}</p>
            <ul className="list-disc ml-5">
              {module.competencies.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
